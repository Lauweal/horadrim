const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development', // 开发模式
  devtool: 'source-map', // 生成 source map
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // 支持的文件扩展名
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // 处理 TypeScript 文件
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/, // 处理 Less 文件
        use: [
          MiniCssExtractPlugin.loader, // 提取 CSS 到单独文件
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // 处理图片文件
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 清理 dist 文件夹
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML 模板文件
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css', // 输出的 CSS 文件名
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000, // 开发服务器端口
    open: true, // 自动打开浏览器
    hot: true, // 热更新
  },
};