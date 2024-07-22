# upload-assets

GitHub Action to upload multiple assets to a release

## Features

This action aims to resolve several outstanding user requests with [@actions/upload-release-asset](https://github.com/actions/upload-release-asset).

* Getting the latest release tag for upload
* [Glob patterns](https://github.com/actions/toolkit/tree/main/packages/glob#patterns) i.e. `./bin/*`, `!/bin/**/*.tmp`
* Succinct - no need to populate `content_type` and a separate path input

## Check out my eBooks 📖 🤓

[You can sponsor me on GitHub](https://github.com/sponsors/alexellis/), or check out my eBooks on Golang for Cloud Native Developers or Node.js for Serverless

Visit my: [eBook store](https://store.openfaas.com) 📖 🤓

## Requirements:

You can run into a "socket hangup", if you do, then add permissions for the action to write to contents.

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

Getting started - use the right NodeJS version with [`nvm`](https://github.com/nvm-sh/nvm):

```bash
nvm install
```

Build:

```bash
npm install
npm run build
```

## License

MIT

## Contribution guide

1) Any contributions must be proposed via a GitHub issue for discussion before being worked on.
2) You should also use `git commit -s` and follow the [DCO](https://developercertificate.org).
