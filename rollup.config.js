import fs from 'fs'
import path from 'path'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning
import { minify } from 'uglify-es'

import pkg from './package.json'

const libraryName = 'dobux'
const override = { compilerOptions: { declaration: false } }

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
}

const cjs = pkg.commonjs || `cjs/${libraryName}.js`
const cjsMin = cjs.replace('.js', '.min.js')
const esm = pkg.module || `esm/${libraryName}.js`
const umd = pkg.browser || `umd/${libraryName}.js`
const umdMin = umd.replace('.js', '.min.js')

const productionPlugins = [
  typescript({
    tsconfigOverride: override,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  resolve(),
  uglify(
    {
      compress: {
        pure_getters: true,
        unsafe: true,
      },
      output: {
        comments: false,
        semicolons: false,
      },
      mangle: {
        reserved: ['payload', 'type', 'meta'],
      },
    },
    minify
  ),
  commonJs(),
]

const developmentPlugins = [
  typescript({
    tsconfigOverride: override,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  resolve(),
  commonJs(),
]

const cjsConfig = [
  {
    input: 'src/index.ts',
    output: { file: cjs, format: 'cjs', exports: 'named', sourcemap: true },
    external: Object.keys(globals),
    plugins: developmentPlugins,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: cjsMin,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    external: Object.keys(globals),
    plugins: productionPlugins,
  },
]

const esmConfig = [
  {
    input: 'src/index.ts',
    output: { file: esm, format: 'es', exports: 'named', sourcemap: true },
    external: Object.keys(globals),
    plugins: developmentPlugins,
  },
]

const umdConfig = [
  {
    input: 'src/index.ts',
    output: {
      name: 'Dobux',
      file: umd,
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      globals,
    },
    external: Object.keys(globals),
    plugins: developmentPlugins,
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'Dobux',
      file: umdMin,
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      globals,
    },
    external: Object.keys(globals),
    plugins: productionPlugins,
  },
]

const root = `'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${cjsMin}')
} else {
  module.exports = require('./${cjs}')
}
`

export default (() => {
  // generate root mapping files
  fs.writeFileSync(path.join(__dirname, 'index.js'), root)

  let config

  switch (process.env.BUILD_ENV) {
    case 'cjs':
      config = cjsConfig[0]
      break
    case 'esm':
      config = esmConfig[0]
      break
    case 'umd':
      config = umdConfig[0]
      break
    default:
      config = cjsConfig.concat(esmConfig).concat(umdConfig)
      break
  }

  return config
})()
