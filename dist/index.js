module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 176:
/***/ ((module) => {

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

/***/ }),

/***/ 336:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const run = __webpack_require__(623);

run();


/***/ }),

/***/ 623:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(518);
const github = __webpack_require__(832);

const path = __webpack_require__(622);
const fs = __webpack_require__(747);
const { pathToFileURL } = __webpack_require__(835);
const GetRelease = __webpack_require__(176)

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const getRelease = new GetRelease(octokit, github.context)

    const uploadUrl = await getRelease.getURL()

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const assetPathsSt = core.getInput('asset_paths', { required: true });
    console.log(typeof assetPathsSt)
    const assetPaths = JSON.parse(assetPathsSt)
    if(!assetPaths || assetPaths.length == 0) {
      core.setFailed("asset_paths must contain a JSON array of quoted paths");
      return
    }
    const contentType = "binary/octet-stream"

    downloadURLs = []
    for(let i = 0; i < assetPaths.length; i++) {
      let asset = assetPaths[i];

      // Determine content-length for header to upload asset
      const contentLength = filePath => fs.statSync(filePath).size;
      // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
      const headers = { 'content-type': contentType, 'content-length': contentLength(asset) };
  
      const assetName = path.basename(asset)
      console.log(`Uploading ${assetName}`)

      // Upload a release asset
      // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
      // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
      const uploadAssetResponse = await octokit.repos.uploadReleaseAsset({
        url: uploadUrl,
        headers,
        name: assetName,
        data: fs.readFileSync(asset)
      });

      console.log(uploadUrl,headers,assetName)
  
      // Get the browser_download_url for the uploaded release asset from the response
      const {
        data: { browser_download_url: browserDownloadUrl }
      } = uploadAssetResponse;
  
      // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
      downloadURLs.push(browserDownloadUrl)
    }

    core.setOutput('browser_download_urls', JSON.stringify(downloadURLs));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;


/***/ }),

/***/ 518:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 832:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(336);
/******/ })()
;