const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel').default;
const { terser } = require('rollup-plugin-terser');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      file: 'dist/horadrim.umd.js', // UMD 输出路径
      format: 'umd', // UMD 格式
      name: 'horadrim', // 挂载到 window.horadrim
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(), // 自动将 peerDependencies 标记为外部依赖
    resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'], 
    }), // 解析 node_modules 中的模块
    commonjs(), // 转换 CommonJS 模块为 ES 模块
    babel({
      babelHelpers: 'runtime', // 使用 Babel runtime
      exclude: 'node_modules/**', // 排除 node_modules
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 支持的文件扩展名
      presets: [
        '@babel/preset-react', // 添加 React 支持
        '@babel/preset-env', // 确保支持现代 JavaScript
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    terser(), // 压缩代码
  ],
    external: ['react', 'react-dom'], // 将 React 和 ReactDOM 标记为外部依赖
};