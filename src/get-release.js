class GetRelease {
    constructor(octokit, context) {
        this.octokit = octokit
        this.context = context;
    }

    async getURL() {
        // Get owner and repo from context of payload that triggered the action
        const { owner, repo } = this.context.repo;
        // Get the tag name from the triggered action
        const tagName = this.context.ref;
    
        // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
        const tag = tagName.replace("refs/tags/", "");
        console.log(this.context.repo, tag)

        // Get a release from the tag name
        // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
        // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
        const getReleaseResponse = await this.octokit.repos.getReleaseByTag({
            owner,
            repo,
            tag
        });
        const uploadURL = getReleaseResponse.data.upload_url
        console.log(`Got release URL: '${uploadURL}'`);
        return uploadURL;
    }
}

module.exports = GetRelease

// const github = require('@actions/github');

// async function runMe() {

//     // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
//     const octokit = github.getOctokit("");
//     const getRelease = new GetRelease(octokit, {
//         ref: "refs/tags/0.1.19",
//         repo: {
//           repo: "release-it",
//           owner:"alexellis",
//         }
//     })
//     const uploadUrl = await getRelease.getURL()
//     console.log(uploadUrl)
//   }

//   runMe()