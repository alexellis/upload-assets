# upload-assets

GitHub Action to upload multiple assets to a release

## Features

This action aims to resolve several outstanding user requests with [@actions/upload-release-asset](https://github.com/actions/upload-release-asset).

* Getting the latest release tag for upload
* Globbing i.e. `./bin/*`
* Succinct - no need to populate content_type and a separate path input

## Check out my eBooks 📖 🤓

[You can sponsor me on GitHub](https://github.com/sponsors/alexellis/), or check out my eBooks on Golang for Cloud Native Developers or Node.js for Serverless

Visit my: [eBook store](https://store.openfaas.com) 📖 🤓

## Permissions

The default permissions of your `GITHUB_TOKEN` should be sufficient to use this action. However, if you need to change any permissions, it is important to note that all unspecified permissions will be set to `none`.

When specifying permissions, the following are required to upload an asset to a release: 
```yaml
    permissions:
      contents: write
      checks: write
      actions: read
      issues: read
      packages: write
      pull-requests: read
      repository-projects: read
      statuses: read
```
Failure to specify these permissions could result in receiving a "socket hangup" or "Resource not accessible by integration" error.

## Input variables

You must provide:

* `asset_paths` - the paths to the assets you want to upload as a JSON array. You can use a glob pattern. For example `asset_paths: '["bin/*", "dist/js/*"]'`

## Output variables

*  `browser_download_urls` - the paths to download the uploaded assets

## Example

```yaml
name: publish

on:
  push:
    tags:
      - '*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: Make all
        run: make all
      - name: Upload release binaries
        uses: alexellis/upload-assets@0.4.0
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          asset_paths: '["./bin/release-it*"]'
```

Example taken from [this sample project](https://github.com/alexellis/release-it/blob/master/.github/workflows/publish.yaml).

## Creating a new version

Getting started:

```bash
npm i -g  @vercel/ncc
```

Build:

```bash
npm i
npm run build
```

## License

MIT


## Contribution guide

1) Any contributions must be proposed via a GitHub issue for discussion before being worked on.
2) You should also use `git commit -s` and follow the [DCO](https://developercertificate.org).
