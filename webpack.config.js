var webpack = require('webpack');

var projectname = "dnd";

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry:  __dirname + "/" + projectname + "/src/App.js",
  output: {
    path: __dirname + "/" + projectname + '/dist',
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015','react']
      }
    }]
  },
  devServer: {
    contentBase: "." + "/" + projectname + '/dist',
    inline: true
  }
}

module.exports = config;
