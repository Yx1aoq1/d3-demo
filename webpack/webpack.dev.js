const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = merge(common, {
  entry: {     
    main: './demo/index.js', // 程序入口        
  },

  output: {
    path: resolve('../dist'),
    publicPath: '/',
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js'
  },
  
  devtool: false,
  plugins: [new webpack.SourceMapDevToolPlugin({})],
})