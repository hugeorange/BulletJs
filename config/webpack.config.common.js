const path = require('path')
const appSrc = path.resolve(__dirname, '../src')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: appSrc + '/index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss']//添加在此的后缀所对应的文件可以省略后缀
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './../dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: appSrc + '/index.html',
      filename: 'index.html'
    })
  ]
}