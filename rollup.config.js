import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const { resolveRoot } = require('./scripts/utils')

const pkgJSONPath = resolveRoot('package.json')
const pkg = require(pkgJSONPath)
const name = path.basename(__dirname)

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
  cjs: {
    file: resolveRoot(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  esm: {
    file: resolveRoot(`dist/${name}.esm.js`),
    format: `es`,
  },
}

const defaultFormats = ['esm', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    throw new Error(`Invalid format: "${format}"`)
  }

  const isProductionBuild = process.env.__DEV__ === 'false'
  const isESMBuild = format === 'esm'
  const isNodeBuild = format === 'cjs'

  output.exports = 'named'
  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false

  const shouldEmitDeclarations = pkg.types && process.env.TYPES != null && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: resolveRoot('tsconfig.json'),
    cacheRoot: resolveRoot('node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      exclude: ['__tests__'],
    },
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const entryFile = `src/index.ts`

  return {
    input: resolveRoot(entryFile),
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      tsPlugin,
      json({
        namedExports: false,
      }),
      createReplacePlugin(isProductionBuild, isESMBuild, isNodeBuild),
      nodeResolve(),
      commonjs(),
      ...plugins,
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
    watch: {
      exclude: ['node_modules/**', 'dist/**'],
    },
  }
}

function createReplacePlugin(isProduction, isESMBuild, isNodeBuild) {
  const replacements = {
    __VERSION__: `"${pkg.version}"`,
    __DEV__: isESMBuild
      ? // preserve to be handled by bundlers
        `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
        !isProduction,
    __ESM__: isESMBuild,
    __NODE_JS__: isNodeBuild,
  }

  // allow inline overrides like
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })

  return replace({
    values: replacements,
    preventAssignment: true,
  })
}
