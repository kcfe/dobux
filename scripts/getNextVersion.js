const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const semver = require('semver')
const logger = require('./utils/logger')
const { getDistTag, getReferenceVersion } = require('./utils/version')

const VERSION_MAJOR = 'Major'
const VERSION_MINOR = 'Minor'
const VERSION_PATCH = 'Patch'

const VERSION_PRE_RELEASE = 'Prerelease'
const VERSION_PRE_MAJOR = 'Premajor'
const VERSION_PRE_MINOR = 'Preminor'
const VERSION_PRE_PATCH = 'Prepatch'

async function getNextVersion(pkgPath, version) {
  if (!pkgPath || !fs.existsSync(pkgPath)) {
    logger.printErrorAndExit(`package.json file ${pkgPath} is not exist.`)
  }

  const pkg = fs.readJSONSync(pkgPath)

  if (!pkg || !pkg.name || !pkg.version) {
    logger.printErrorAndExit(`package.json file ${pkgPath} is not valid.`)
  }

  const localVersion = version || pkg.version

  const {
    remoteLatestVersion,
    remoteAlphaVersion,
    remoteBetaVersion,
    remoteNextVersion,
  } = await getDistTag(pkg.name)

  logger.info(`本地版本: ${chalk.cyanBright.bold(localVersion)}`)

  if (remoteLatestVersion) {
    logger.info(`  - 远程最新版本: ${chalk.cyanBright.bold(remoteLatestVersion)}`)
  }

  if (remoteAlphaVersion) {
    logger.info(`  - 远程内测版本: ${chalk.cyanBright.bold(remoteAlphaVersion)}`)
  }

  if (remoteBetaVersion) {
    logger.info(`  - 远程测试版本: ${chalk.cyanBright.bold(remoteBetaVersion)}`)
  }

  if (remoteNextVersion) {
    logger.info(`  - 远程先行版本: ${chalk.cyanBright.bold(remoteNextVersion)}`)
  }

  console.log()

  const referenceVersion = getReferenceVersion(remoteLatestVersion, localVersion)
  const alphaReferenceVersion = getReferenceVersion(remoteAlphaVersion, localVersion)
  const betaReferenceVersion = getReferenceVersion(remoteBetaVersion, localVersion)
  const nextReferenceVersion = getReferenceVersion(remoteNextVersion, localVersion)

  const suggestions = {
    [VERSION_MAJOR]: semver.inc(referenceVersion, VERSION_MAJOR.toLowerCase()),
    [VERSION_MINOR]: semver.inc(referenceVersion, VERSION_MINOR.toLowerCase()),
    [VERSION_PATCH]: semver.inc(referenceVersion, VERSION_PATCH.toLowerCase()),
    Alpha: {
      [VERSION_PRE_MAJOR]: semver.inc(
        alphaReferenceVersion,
        VERSION_PRE_MAJOR.toLowerCase(),
        'alpha'
      ),
      [VERSION_PRE_MINOR]: semver.inc(
        alphaReferenceVersion,
        VERSION_PRE_MINOR.toLowerCase(),
        'alpha'
      ),
      [VERSION_PRE_PATCH]: semver.inc(
        alphaReferenceVersion,
        VERSION_PRE_PATCH.toLowerCase(),
        'alpha'
      ),
      [VERSION_PRE_RELEASE]: semver.inc(
        alphaReferenceVersion,
        VERSION_PRE_RELEASE.toLowerCase(),
        'alpha'
      ),
    },
    Beta: {
      [VERSION_PRE_MAJOR]: semver.inc(
        betaReferenceVersion,
        VERSION_PRE_MAJOR.toLowerCase(),
        'beta'
      ),
      [VERSION_PRE_MINOR]: semver.inc(
        betaReferenceVersion,
        VERSION_PRE_MINOR.toLowerCase(),
        'beta'
      ),
      [VERSION_PRE_PATCH]: semver.inc(
        betaReferenceVersion,
        VERSION_PRE_PATCH.toLowerCase(),
        'beta'
      ),
      [VERSION_PRE_RELEASE]: semver.inc(
        betaReferenceVersion,
        VERSION_PRE_RELEASE.toLowerCase(),
        'beta'
      ),
    },
    Rc: {
      [VERSION_PRE_MAJOR]: semver.inc(nextReferenceVersion, VERSION_PRE_MAJOR.toLowerCase(), 'rc'),
      [VERSION_PRE_MINOR]: semver.inc(nextReferenceVersion, VERSION_PRE_MINOR.toLowerCase(), 'rc'),
      [VERSION_PRE_PATCH]: semver.inc(nextReferenceVersion, VERSION_PRE_PATCH.toLowerCase(), 'rc'),
      [VERSION_PRE_RELEASE]: semver.inc(
        nextReferenceVersion,
        VERSION_PRE_RELEASE.toLowerCase(),
        'rc'
      ),
    },
  }

  const maxVersionName = Math.max(
    `${VERSION_PATCH} (${suggestions[VERSION_PATCH]})`.length,
    `${VERSION_MINOR} (${suggestions[VERSION_MINOR]})`.length,
    `${VERSION_MAJOR} (${suggestions[VERSION_MAJOR]})`.length
  )
  const choices = [
    {
      short: suggestions[VERSION_PATCH],
      name: `${`${VERSION_PATCH} (${suggestions[VERSION_PATCH]})`.padEnd(
        maxVersionName,
        ' '
      )} ${chalk.grey(`- 递增修订版本号(用于 bug 修复)`)}`,
      value: suggestions[VERSION_PATCH],
    },
    {
      short: suggestions[VERSION_MINOR],
      name: `${`${VERSION_MINOR} (${suggestions[VERSION_MINOR]})`.padEnd(
        maxVersionName,
        ' '
      )} ${chalk.grey(`- 递增特性版本号(用于向下兼容的特性新增)`)}`,
      value: suggestions[VERSION_MINOR],
    },
    {
      short: suggestions[VERSION_MAJOR],
      name: `${`${VERSION_MAJOR} (${suggestions[VERSION_MAJOR]})`.padEnd(
        maxVersionName,
        ' '
      )} ${chalk.grey(`- 递增主版本号  (用于断代更新或大版本发布)`)}`,
      value: suggestions[VERSION_MAJOR],
    },
    {
      name: `${'Beta'.padEnd(maxVersionName, ' ')} ${chalk.grey(`- 递增外部测试版本`)}`,
      value: 'Beta',
    },
    {
      name: `${'Alpha'.padEnd(maxVersionName, ' ')} ${chalk.grey(`- 递增内部测试版本`)}`,
      value: 'Alpha',
    },
    {
      name: `${'Rc'.padEnd(maxVersionName, ' ')} ${chalk.grey(`- 递增候选版本`)}`,
      value: 'Rc',
    },
  ]

  let nextVersion = await inquirer.prompt({
    name: 'value',
    type: 'list',
    message: '请选择要升级的版本号：',
    choices,
  })

  switch (nextVersion.value) {
    case 'Beta':
      nextVersion = await inquirer.prompt({
        name: 'value',
        type: 'list',
        message: '请选择要升级的 Beta 版本号：',
        choices: [
          {
            short: suggestions.Beta[VERSION_PRE_RELEASE],
            name: `${VERSION_PRE_RELEASE} (${suggestions.Beta[VERSION_PRE_RELEASE]})`,
            value: suggestions.Beta[VERSION_PRE_RELEASE],
          },
          {
            short: suggestions.Beta[VERSION_PRE_PATCH],
            name: `${VERSION_PRE_PATCH}   (${suggestions.Beta[VERSION_PRE_PATCH]})`,
            value: suggestions.Beta[VERSION_PRE_PATCH],
          },
          {
            short: suggestions.Beta[VERSION_PRE_MINOR],
            name: `${VERSION_PRE_MINOR}   (${suggestions.Beta[VERSION_PRE_MINOR]})`,
            value: suggestions.Beta[VERSION_PRE_MINOR],
          },
          {
            short: suggestions.Beta[VERSION_PRE_MAJOR],
            name: `${VERSION_PRE_MAJOR}   (${suggestions.Beta[VERSION_PRE_MAJOR]})`,
            value: suggestions.Beta[VERSION_PRE_MAJOR],
          },
        ],
      })
      break
    case 'Alpha':
      nextVersion = await inquirer.prompt({
        name: 'value',
        type: 'list',
        message: '请选择要升级的 Alpha 版本号：',
        choices: [
          {
            short: suggestions.Alpha[VERSION_PRE_RELEASE],
            name: `${VERSION_PRE_RELEASE} (${suggestions.Alpha[VERSION_PRE_RELEASE]})`,
            value: suggestions.Alpha[VERSION_PRE_RELEASE],
          },
          {
            short: suggestions.Alpha[VERSION_PRE_PATCH],
            name: `${VERSION_PRE_PATCH}   (${suggestions.Alpha[VERSION_PRE_PATCH]})`,
            value: suggestions.Alpha[VERSION_PRE_PATCH],
          },
          {
            short: suggestions.Alpha[VERSION_PRE_MINOR],
            name: `${VERSION_PRE_MINOR}   (${suggestions.Alpha[VERSION_PRE_MINOR]})`,
            value: suggestions.Alpha[VERSION_PRE_MINOR],
          },
          {
            short: suggestions.Alpha[VERSION_PRE_MAJOR],
            name: `${VERSION_PRE_MAJOR}   (${suggestions.Alpha[VERSION_PRE_MAJOR]})`,
            value: suggestions.Alpha[VERSION_PRE_MAJOR],
          },
        ],
      })
      break
    case 'Rc':
      nextVersion = await inquirer.prompt({
        name: 'value',
        type: 'list',
        message: '请选择要升级的 Rc 版本号：',
        choices: [
          {
            short: suggestions.Rc[VERSION_PRE_RELEASE],
            name: `${VERSION_PRE_RELEASE} (${suggestions.Rc[VERSION_PRE_RELEASE]})`,
            value: suggestions.Rc[VERSION_PRE_RELEASE],
          },
          {
            short: suggestions.Rc[VERSION_PRE_PATCH],
            name: `${VERSION_PRE_PATCH}   (${suggestions.Rc[VERSION_PRE_PATCH]})`,
            value: suggestions.Rc[VERSION_PRE_PATCH],
          },
          {
            short: suggestions.Rc[VERSION_PRE_MINOR],
            name: `${VERSION_PRE_MINOR}   (${suggestions.Rc[VERSION_PRE_MINOR]})`,
            value: suggestions.Rc[VERSION_PRE_MINOR],
          },
          {
            short: suggestions.Rc[VERSION_PRE_MAJOR],
            name: `${VERSION_PRE_MAJOR}   (${suggestions.Rc[VERSION_PRE_MAJOR]})`,
            value: suggestions.Rc[VERSION_PRE_MAJOR],
          },
        ],
      })
      break
    default:
      break
  }

  pkg.version = nextVersion.value

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  logger.success(`回写版本号 ${nextVersion.value} 到 ${pkgPath} 成功 \n`)

  return pkg.version
}

module.exports = getNextVersion
