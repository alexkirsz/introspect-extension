const { resolve: r } = require("path");

module.exports = {
  mode: "development",

  entry: {
    hook: r("./src/hook.js"),
    inject: r("./src/inject.js"),
    background: r("./src/background.js")
  },

  resolve: {
    alias: {
      react: r("./src/react.js"),
      "react-dom": r("./src/react-dom.js")
    }
  },

  output: {
    path: r("./extension/lib"),
    filename: "[name].js"
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader"
      },
      {
        test: /\.css?$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { modules: true } }
        ]
      },
      {
        test: /\.svg?$/,
        use: [{ loader: "react-svg-loader" }]
      }
    ]
  }
};
