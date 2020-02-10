const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 每次执行打包 先清除之前的打包文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

const appSrc = path.resolve(__dirname, '../src')

module.exports = merge(common, {
  mode: 'production',
  // 出口
  output: {
    pathinfo: false,
    chunkFilename: 'js/[name].chunk.js',
    // publicPath: 'http://w1.hoopchina.com.cn/allback/',
    publicPath: 'http://w1.hoopchina.com.cn/games/static/devbup-basketballfrontend',
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: path.resolve(__dirname, './../build'),
    filename: "js/[name].[chunkhash:8].js"
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: appSrc,
      // exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env", "@babel/preset-react"]
      }
    },
    // 针对静态文件
    {
      test: /\.(png|jpg|gif)$/,
      loader: "url-loader",
      options: {
        limit: 10000,
        name: 'static/[name].[hash:8].[ext]',
      }
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },{
      test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            javascriptEnabled: true,
          }
        }]
    },
    {
      test: /\.(ttf|eot|woff|woff2)$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
      },
    }]
  },
  plugins: [
    // 打包前清除之前的build目录
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name][hash:8].css",
      chunkFilename: "[id].css",
      publicPath: 'http://w1.hoopchina.com.cn/games/static/devbup-basketballfrontend'
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})
