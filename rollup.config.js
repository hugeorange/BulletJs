import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
// import livereload from 'rollup-plugin-livereload';
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const isDev = process.env.NODE_ENV !== 'production'

const sourcemap = isDev ? true : false

let plugins = []
if (isDev) {
  // 或者不用这种方式进行测试，直接在index.html 用相对路劲引入dist内打包后的文件
  plugins = [
    serve({
      port: 3007,
      // open: true,
      openPage: '/',
      contentBase: ['dist', 'src'],
    }),
    // htmlTemplate({
    //     template: 'src/index.html',
    //     target: 'index.html'
    // })
  ]
} else {
  plugins = [terser()]
}

export default {
  input: 'src/comps/core.ts',
  output: [
    { name: 'BulletJs', file: pkg.main, format: 'cjs', sourcemap },
    { name: 'BulletJs', file: pkg.module, format: 'es', sourcemap },
    { name: 'BulletJs', file: pkg.unpkg, format: 'umd', sourcemap },
  ],
  plugins: [
    resolve(), // 引用commonjs模块时需要
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true, // 使plugin-transform-runtime生效
    }),
    commonjs(), // 引用commonjs模块时需要
    typescript({
      exclude: 'node_modules/**',
      declarationDir: process.cwd(),
    }),
    ...plugins,
  ],
}

/**
   如果需要exteral的时候可以用 rollup-plugin-peer-deps-external这个插件将依赖排除
     external: [
        ...(pkg.dependencies == null ? [] : Object.keys(pkg.dependencies)),
        ...(pkg.devDependencies == null ? [] : Object.keys(pkg.devDependencies)),
     ]
     
  rollup-plugin-delete 类似webpack的cleanWebpackPlugin
*/
