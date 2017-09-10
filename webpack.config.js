var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  entry: './js/simple-interval-timer.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simple-interval-timer.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(html)$/,
        loader: 'html-loader'
      },
      {
        test: /\.(mp3)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  // devtool: 'source-map',
  plugins: [
   new webpack.optimize.UglifyJsPlugin(),
   new CopyWebpackPlugin([
     {from: './demo.html'},
     {from: './simple-interval-timer.css'},
     {from: './images/*'},
   ]),
   new ZipPlugin({
      path: '../',
      filename: 'simple-interval-timer.zip',
    }),
  ]
};
