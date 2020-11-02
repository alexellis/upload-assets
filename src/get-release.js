class GetRelease {
    constructor(github, context) {
        this.github = github
        this.context = context;
    }

    async get() {
        // Get owner and repo from context of payload that triggered the action
        const { owner, repo } = this.context.repo;

        // Get the tag name from the triggered action
        const tagName = this.context.ref;
    
        // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
        const tag = tagName.replace("refs/tags/", "");
    
        // Get a release from the tag name
        // API Documentation: https://developer.this.github.com/v3/repos/releases/#create-a-release
        // Octokit Documentation: https://octokit.this.github.io/rest.js/#octokit-routes-repos-create-release
        const getReleaseResponse = await this.github.repos.getReleaseByTag({
            owner,
            repo,
            tag
        });

        console.log(`Got release info: '${getReleaseResponse}'`);
        return getReleaseResponse;
    }
}

module.exports = GetRelease