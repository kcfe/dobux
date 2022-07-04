const cp = require('child_process')
const path = require('path')
const { logger } = require('@eljs/release')

const { resolveRoot, bin, run } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const buildTypes = args.t || args.types

main()

async function main() {
  const pkgJSONPath = resolveRoot('package.json')
  const pkg = require(pkgJSONPath)

  if (pkg.private) {
    return
  }

  logger.step(`Watching ${chalk.cyanBright.bold(pkg.name)}`, 'Dev')
  if (buildTypes) {
    const watch = cp.spawn(bin('rollup'), [
      '-c',
      '-w',
      '--environment',
      [`FORMATS:cjs`, `TYPES:true`],
    ])

    watch.stdout.on('data', data => {
      console.log(data.toString())
      try {
        doBuildTypes()
      } catch (err) {}
    })

    watch.stderr.on('data', data => {
      console.log(data.toString())
      try {
        doBuildTypes()
      } catch (err) {}
    })

    function doBuildTypes() {
      if (buildTypes && pkg.types) {
        const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

        const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
        const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
        const extractorResult = Extractor.invoke(extractorConfig, {
          localBuild: true,
          showVerboseMessages: true,
        })

        if (!extractorResult.succeeded) {
          logger.printErrorAndExit(
            `API Extractor completed with ${extractorResult.errorCount} errors` +
              ` and ${extractorResult.warningCount} warnings.`
          )
        }

        removeSync(`${pkgDir}/dist/packages`)
      }
    }
  } else {
    await run(bin('rollup'), ['-c', '-w', '--environment', [`FORMATS:cjs`]])
  }
}
