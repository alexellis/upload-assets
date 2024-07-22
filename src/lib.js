const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob');

const path = require('path');
const fsPromises = require('fs/promises');

const getReleaseURL = async (octokit, context) => {
  // Get owner and repo from context of payload that triggered the action
  const { owner, repo } = context.repo;

  // Get the tag name from the triggered action
  const tagName = context.ref;

  // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
  const tag = tagName.replace('refs/tags/', '');

  // Get a release from the tag name
  // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
  // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
  const getReleaseResponse = await octokit.repos.getReleaseByTag({
    owner,
    repo,
    tag
  });

  const uploadURL = getReleaseResponse.data.upload_url;

  return uploadURL;
};

const run = async () => {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

    const uploadUrl = await getReleaseURL(octokit, github.context);

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const assetPathsStr = core.getInput('asset_paths', { required: true });
    const globber = await glob.create(assetPathsStr);
    const paths = await globber.glob();

    if (paths.length === 0) {
      core.setFailed(`Could not find any artifacts with paths: ${assetPathsStr}`);
      return;
    }

    core.debug(`Expanded paths: ${paths}`);

    const downloadURLs = [];

    for await (const assetPath of paths) {
      // Determine content-length for header to upload asset
      const stats = await fsPromises.stat(assetPath);
      const contentLength = stats.size;
      const contentType = 'binary/octet-stream';

      // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
      const headers = {
        'content-type': contentType,
        'content-length': contentLength,
      };

      const assetName = path.basename(assetPath);

      const content = await fsPromises.readFile(assetPath);

      const request = {
        url: uploadUrl,
        headers,
        name: assetName,
        data: content,
      };

      core.info(`Uploading asset ${request.name}`);

      // Upload a release asset
      // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
      // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
      const uploadAssetResponse = await octokit.repos.uploadReleaseAsset(request);

      // Get the browser_download_url for the uploaded release asset from the response
      const {
        data: { browser_download_url: browserDownloadUrl }
      } = uploadAssetResponse;

      // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
      downloadURLs.push(browserDownloadUrl);
    }

    core.setOutput('browser_download_urls', JSON.stringify(downloadURLs));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
