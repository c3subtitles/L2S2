/* eslint camelcase: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const node_env = (process.env.NODE_ENV || 'development').trim();
const configPath = `configuration.${node_env}.js`;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

let plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      BLUEBIRD_LONG_STACK_TRACES: JSON.stringify(false),
      NODE_ENV: JSON.stringify(node_env),
    },
    IS_PRODUCTION: JSON.stringify(node_env === 'production'),
    CONFIGPATH: JSON.stringify(configPath),
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'html-loader!src/index.html',
    minify: {},
  }),
  // new HtmlWebpackPlugin({
  //   filename: 'clean/index.html',
  //   template: 'html-loader!src/Clean/index.html',
  //   minify: {},
  // }),
];

let jsLoader = 'babel-loader!eslint-loader';
if (node_env === 'production') {
  plugins = plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin(),
  ]);
  jsLoader = 'babel-loader';
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
      bluebird: 'bluebird/js/release/bluebird.js',
      eventemitter: 'eventemitter3',
      // react: 'inferno-compat',
      // 'react-dom': 'inferno-compat',
    },
  },
  entry: {
    Common: [
      'react-hot-loader/patch',
      path.resolve('src/index.js'),
    ],
    // Clean: path.resolve('src/Clean/index.js'),
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
        exclude: /(node_modules|primusClient)/,
        include: /src/,
        loader: jsLoader,
      },
      { test: /(\.scss|\.css)$/, loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass' },
      { test: /\.(jpg|png|gif|jpeg|ico)$/, loader: 'url-loader?limit=10000' },
      { test: /\.woff2?(\?.*)?$/, loader: 'file-loader' },
      { test: /\.(eot|ttf|otf|svg)(\?.*)?$/, loader: 'file-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ],
    noParse: [
      /primusClient\.js/,
      /.*primusClient.*/,
    ],
  },
  postcss: [autoprefixer],
  sassLoader: {
    data: '@import "Theme/_config.scss";',
    includePaths: [path.resolve(__dirname, './src')],
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
      '/primus/*': {
        target: 'http://localhost:9500/',
        changeOrigin: true,
        xfwd: true,
        ws: true,
        secure: false,
      },
    },
  },
};

if (process.env.DASHBOARD) {
  const DashboardPlugin = require('webpack-dashboard/plugin');

  webpackConfig.plugins.push(new DashboardPlugin());
}

if (node_env !== 'production') {
  webpackConfig.devtool = '#source-map';
}

module.exports = webpackConfig;
