const path = require("path");
var webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  resolve: {
	fallback: {
		"os": require.resolve("os-browserify/browser"),
		"https": require.resolve("https-browserify"),
		"http": require.resolve("stream-http"),
		"crypto": require.resolve("crypto-browserify"),
		 "stream": require.resolve("stream-browserify"),
	    "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
	} 
  },
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
    	patterns: [
    		{ from: "./src/index.html", to: "index.html" },
    	],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
