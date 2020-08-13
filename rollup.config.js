import resolve from 'rollup-plugin-node-resolve';
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';


const devPlugin = [
    serve({
        port: 3000,
        open: true,
        openPage: '/',
        contentBase: ['dist', 'src']
    })
]

const prodPlugin = [
    terser()
]

const plugin = isDev ? devPlugin : prodPlugin
const sourcemap = isDev ? true : false

export default {
    input: 'src/comps/index.js',
    output: [
        { name: "BulletJs", file: pkg.main, format: 'cjs', sourcemap },
        { name: "BulletJs", file: pkg.module, format: 'es', sourcemap },
        { name: "BulletJs", file: pkg.unpkg, format: 'umd', sourcemap }
    ],
    plugins: [
        resolve(), // 引用commonjs模块时需要
        commonjs(), // 引用commonjs模块时需要
        babel({
            exclude: 'node_modules/**', // 防止打包node_modules下的文件
            runtimeHelpers: true,       // 使plugin-transform-runtime生效
        }),
        ...plugin
    ]
}
