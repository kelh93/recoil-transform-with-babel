const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const cacheGroupsVendor = /(react|react-dom)/;
const cacheGroupsLibs = /(antd|recoil)/;
const srcDir = resolve(__dirname, '../src');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  entry: {
    main: resolve(__dirname, '../src/index.js'),
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        // exclude: function (modulePath) {
        //   return /node_modules/.test(modulePath) && /recoil/.test(modulePath);
        // },
        // exclude: [resolve(__dirname, '../node_modules/recoil')],
        include: [srcDir, resolve(__dirname, '../node_modules/recoil')],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    // webpack4移除了 CommonChunkPlugin,使用 splitChunks 代替。
    splitChunks: {
      chunks: 'all',
      minSize: 1024 * 20, // 20kb
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000, //
      cacheGroups: {
        default: false,
        vendor: false,
        vendor: {
          chunks: 'initial',
          test: cacheGroupsVendor,
          priority: 15,
          name: 'vendor',
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
        },
        libs: {
          name: 'libs',
          test: cacheGroupsLibs,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          minChunks: 1,
        },
        commons: {
          chunks: 'all',
          minChunks: 6,
          name: 'commons',
          priority: 5,
          maxSize: 409600, // 240kb
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../public/index.html'),
    }),
  ],
};
