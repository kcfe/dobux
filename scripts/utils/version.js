const semver = require('semver')
const chalk = require('chalk')
const { exec } = require('./cp')
const logger = require('./logger')

function isPrerelease(version) {
  return isAlphaVersion(version) || isBetaVersion(version) || isRcVersion(version)
}

function isAlphaVersion(version) {
  return version.includes('-alpha.')
}

function isRcVersion(version) {
  return version.includes('-rc.')
}

function isBetaVersion(version) {
  return version.includes('-beta.')
}

async function getDistTag(pkgName) {
  let remoteLatestVersion = ''
  let remoteAlphaVersion = ''
  let remoteBetaVersion = ''
  let remoteNextVersion = ''

  try {
    const distTags = (await exec(`npm dist-tag ${pkgName}`)).split('\n')

    distTags.forEach(tag => {
      if (tag.startsWith('latest')) {
        remoteLatestVersion = tag.split(': ')[1]
      }

      if (tag.startsWith('alpha')) {
        remoteAlphaVersion = tag.split(': ')[1]
      }

      if (tag.startsWith('beta')) {
        remoteBetaVersion = tag.split(': ')[1]
      }

      if (tag.startsWith('next')) {
        remoteNextVersion = tag.split(': ')[1]
      }
    })
  } catch (err) {
    if (err.message.includes('command not found')) {
      logger.error(`Please make sure the ${chalk.cyanBright.bold('npm')} has been installed`)
      process.exit(1)
    } else {
      logger.info(`The package ${chalk.cyanBright.bold(pkgName)} has not been published.`)
      console.log()
    }
  }

  return {
    remoteLatestVersion,
    remoteAlphaVersion,
    remoteBetaVersion,
    remoteNextVersion,
  }
}

function getReferenceVersion(remoteVersion, localVersion) {
  if (!remoteVersion) {
    return localVersion
  }

  const baseRemoteVersion = remoteVersion.split('-')[0]
  const baseLocalVersion = localVersion.split('-')[0]

  if (
    (isAlphaVersion(remoteVersion) && isBetaVersion(localVersion)) ||
    ((isBetaVersion(remoteVersion) || isAlphaVersion(remoteVersion)) && isRcVersion(localVersion))
  ) {
    if (baseRemoteVersion === baseLocalVersion) {
      return remoteVersion
    }
  }

  return semver.gt(remoteVersion, localVersion) ? remoteVersion : localVersion
}

module.exports = {
  isPrerelease,
  isAlphaVersion,
  isBetaVersion,
  isRcVersion,
  getDistTag,
  getReferenceVersion,
}
