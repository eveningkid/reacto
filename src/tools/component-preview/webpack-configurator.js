const path = window.require('path');

export const babelConfig = {
  presets: [
    ["env", {
      "targets": { "node": "current" },
      // "modules": false,
    }],
    "react",
    "flow",
    "stage-3"
  ],
  babelrc: false,
};

export default function webpackConfigurator(options) {
  return {
    entry: options.entryFilePath,
    output: {
      filename: options.outputFilename,
    },
    module: {
      rules: [
        { test: /\.css$/, use: 'css-loader' },
        {
          test: /\.js|\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
        { test: /\.svg$/, use: 'svg-inline-loader' },
      ],
    },
    resolve: {
      modules: [
        path.resolve(options.cwd, "node_modules"),
        options.cwd,
      ],
      extensions: [".js", ".json", ".jsx", ".css", ".svg"],
    },
  };
}
