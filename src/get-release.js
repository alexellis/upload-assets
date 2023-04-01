class GetRelease {
    constructor(octokit, context, tag) {
        this.octokit = octokit
        this.context = context;
        this.tag = tag || context.ref;
    }

    async getURL() {
        // Get owner and repo from context of payload that triggered the action
        const { owner, repo } = this.context.repo;
        const tag = this.tag.replace("refs/tags/", "");

        // Get a release from the tag name
        // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
        // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
        const getReleaseResponse = await this.octokit.repos.getReleaseByTag({
            owner,
            repo,
            tag
        });

        const uploadURL = getReleaseResponse.data.upload_url
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
