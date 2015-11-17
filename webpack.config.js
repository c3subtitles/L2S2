/* eslint camelcase: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const node_env = (process.env.NODE_ENV || 'development').trim();
const configPath = `configuration.${node_env}.js`;
const HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(node_env),
    },
    CONFIGPATH: JSON.stringify(configPath),
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html',
    minify: {},
  }),
];

let jsLoader = 'babel!eslint';
if (node_env === 'production') {
  plugins = plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2,
      names: ['Common'],
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warning: false,
      },
    }),
  ]);
  jsLoader = 'babel';
}

const webpackConfig = {
  eslint: {
    configFile: '.eslintrc',
    failOnWarning: false,
    failOnError: true,
  },
  context: __dirname,
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: path.resolve('src'),
    alias: {
      eventemitter: 'eventemitter3',
    },
  },
  entry: {
    'Common': path.resolve('src/entry.js'),
  },
  output: {
    path: path.resolve('www'),
    filename: '[name]-[hash].js',
    chunkFilename: '[id]-[chunkhash].js',
    publicPath: '/',
  },
  module: {
    loaders: [
      { test: /^((?!CSS\.js$).)*(\.jsx?)$/,
        exclude: /(node_modules)/,
        loader: jsLoader,
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.CSS.js$/, exclude: /(node_modules)/, loader: 'inline-css!babel' },
      { test: /\.(jpg|png|gif|jpeg|ico)$/, loader: 'url?limit=10000' },
      { test: /\.woff2?(\?.*)?$/, loader: 'file' },
      { test: /\.(eot|ttf|otf|svg)(\?.*)?$/, loader: 'file' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
  plugins,
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:9500/',
        changeOrigin: true,
        xfwd: true,
        ws: true,
        secure: false,
      },
    },
  },
};

if (node_env !== 'production') {
  webpackConfig.devtool = 'cheap-module-source-map';
}

module.exports = webpackConfig;
