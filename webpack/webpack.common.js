const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    contentBase: resolve('../dist'),
    hot: true,
    open: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'style-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
          ],
          plugins: [
            '@babel/plugin-transform-runtime'
          ]
        }
      }
    ]
  },

  resolve: {
    alias: {
      '@': resolve('../src/')
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash].css'
    }),
    new HtmlWebpackPlugin({ //  将webpack生成的文件在html中引用
      filename: 'index.html', //  文件路径
      template: resolve('../index.html'), //  文件模板
      minify: {
        removeComments: true, //  移除HTML中的注释
        collapseWhitespace: true //  删除空白符与换行符
      }
    })
  ]
}