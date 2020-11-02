# upload-assets

GitHub Action to upload multiple assets to a release

## Features

This action aims to resolve several outstanding user requests with [@actions/upload-release-asset](https://github.com/actions/upload-release-asset).

* Getting the latest release tag for upload
* Globbing i.e. `./bin/*`
* Succinct - no need to populate content_type and a separate path input

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
        uses: alexellis/upload-assets@0.2.2
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

