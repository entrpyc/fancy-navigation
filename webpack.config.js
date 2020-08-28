const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  entry: isProduction ? './src/Navigation.js' : './index.js',
  mode: "development",
  output: {
    path: path.resolve(__dirname, './out'),
    filename: './index.js'
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        }
      }
    ],
  },
  plugins: [
    new LiveReloadPlugin(),
    new CleanWebpackPlugin(),
  ]
};

if (!isProduction) {
  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Custom template',
    // Load a custom template (lodash by default)
    template: 'index.html'
  }))
}

module.exports = config