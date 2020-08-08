import resolve from 'rollup-plugin-node-resolve';
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';

export default {
    input: 'src/comps/index.js',
    output: [
        { name: "danmujs", file: pkg.main, format: 'cjs' },
        { name: "danmujs", file: pkg.module, format: 'es' },
        { name: "danmujs", file: pkg.unpkg, format: 'umd' }
    ],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**', // 防止打包node_modules下的文件
            runtimeHelpers: true,       // 使plugin-transform-runtime生效
        }),
        // terser(),
        serve({
            port: 3000,
            contentBase: ['']
        })
    ]
}
