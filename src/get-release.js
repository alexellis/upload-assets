export default class GetRelease {
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

        // Get a release from the tag name
        // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
        // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
        const getReleaseResponse = await this.octokit.rest.repos.getReleaseByTag({
            owner,
            repo,
            tag
        });

        const uploadURL = getReleaseResponse.data.upload_url
        return uploadURL;
    }
}
