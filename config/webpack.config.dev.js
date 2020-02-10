const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const appSrc = path.resolve(__dirname, '../src')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-eval-source-map',
  // 出口
  output: {
    pathinfo: true,
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    // chunk名称配置
    chunkFilename: '[name].chunk.js',
    // 输出的文件名配置
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.html/,
        use: [{
          loader: 'html-loader'
        }]
      }, 
      {
        test: /\.(js|jsx)$/,
        // exclude: /node_modules/,
        include: appSrc,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      // 针对静态文件
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'static/[name].[hash:8].[ext]',
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0,
            },
          }
        ]
      },
      {
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
      }
    ]
  },
  devServer: {
    // HOST
    host: '127.0.0.1',
    // 端口
    port: 7777,
    // 报错提示在网页遮罩层
    overlay: true,
    // 显示运行进度
    progress: true,
    proxy: {
      '/api': {
        target: 'https://stg-m.hupu.com/',
        // pathRewrite: {'^/api' : ''},
        secure: false, 
        changeOrigin: true,
        ws: false,
      }
    }
  }
})
