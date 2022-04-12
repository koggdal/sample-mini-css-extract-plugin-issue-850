const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[chunkhash:8].css",
      ignoreOrder: true,
      experimentalUseImportModule: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        "my-feature": {
          test: (module) => {
            return module.context
              ? /\/my-feature($|\/)/.test(module.context)
              : false;
          },
          name: "my-feature",
          reuseExistingChunk: true,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
};
