# Sample for mini-css-extract-plugin [issue 850](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/850)

## Main issue

Chunks aren't split properly for CSS when using `mini-css-extract-plugin@>=2.4.0` (or older together with `experimentalUseImportModule: true`).

## How to run examples

There are three example folders:

- `working-example`
- `failing-example`
- `fixed-example`

1. `cd <example-folder>`
2. `npm install`
3. `npm run build`

The expected output should contain the following:

```
asset main.js 1.06 KiB [emitted] [minimized] (name: main)
asset my-feature.js 178 bytes [emitted] [minimized] (name: my-feature) (id hint: my-feature)
asset my-feature.3f6efc35.css 31 bytes [emitted] [immutable] (name: my-feature) (id hint: my-feature)
```

The output of the failing example (not actually failing, but failing to match expectations):

```
asset main.js 1.06 KiB [emitted] [minimized] (name: main)
asset my-feature.js 178 bytes [emitted] [minimized] (name: my-feature) (id hint: my-feature)
asset main.3f6efc35.css 31 bytes [emitted] [immutable] (name: main)
```

## Details

This example repo contains three almost identical projects showcasing a working setup, a failing setup, and a fixed setup.

The main difference in the example folders is the use of `experimentalUseImportModule` in `webpack.config.js`.

In `mini-css-extract-plugin@2.3.0` things worked fine by default, as it was relying on the default `experimentalUseImportModule: false` path.

In `mini-css-extract-plugin@2.4.0` things stopped working by default, as it was then relying on the default `experimentalUseImportModule: true` path. `mini-css-extract-plugin@2.3.0` fails in the same way if setting `experimentalUseImportModule: true` manually in the config.

The issue with using `experimentalUseImportModule: true` is that inside the loader it calls `handleExports(exports)` here:
https://github.com/webpack-contrib/mini-css-extract-plugin/blob/v2.6.0/src/loader.js#L299

The signature for that function is `(originalExports, compilation, assets, assetsInfo)`:
https://github.com/webpack-contrib/mini-css-extract-plugin/blob/v2.6.0/src/loader.js#L96

That means the `compilation` variable isn't set, and then further down we fall into another code path for setting the `context`:
https://github.com/webpack-contrib/mini-css-extract-plugin/blob/v2.6.0/src/loader.js#L187

The `context` property then gets set from `context = this.rootContext;`, and `this.rootContext` seems to be the project folder, and that causes the CSS to become part of the wrong chunk.

The `fixed-example` uses a git reference in the `package.json`, pointing to a branch where it's been fixed: https://github.com/koggdal/mini-css-extract-plugin/commit/a501265d717e143dc98b2760e93e9d2aeb85bb62

**This may or may not be the right fix. This does fix the issue presented in this sample repo, but I'm not sure if it works for all supported use cases.**
