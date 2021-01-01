const path = require('path')
const chalk = require('chalk')
const newGithubReleaseUrl = require('new-github-release-url')
const open = require('open')

const generateChangelog = require('./changelog')
const getNextVersion = require('./getNextVersion')
const { isPrerelease, isAlphaVersion, isBetaVersion, isRcVersion } = require('./utils/version')
const logger = require('./utils/logger')
const { exec } = require('./utils/cp')

const pkgPath = path.join(__dirname, '../package.json')
const { name, repository } = require(pkgPath)

/**
 * Workflow
 *
 * 1. Make changes
 * 2. Commit those changes
 * 3. Make sure Travis turns green
 * 4. Bump version in package.json
 * 5. conventionalChangelog
 * 6. Commit package.json and CHANGELOG.md files
 * 7. Tag
 * 8. Push
 */
async function release() {
  const hasModified = await exec('git status --porcelain')

  if (hasModified) {
    logger.printErrorAndExit('Your git status is not clean. Aborting.')
  }

  const userRegistry = await exec('npm config get registry')

  if (!userRegistry.includes('https://registry.npmjs.org/')) {
    const registry = chalk.blue('https://registry.npmjs.org/')
    logger.printErrorAndExit(`Release failed, npm registry must be ${registry}.`)
  }

  logger.step(`bump version`)
  const nextVersion = await getNextVersion(pkgPath)

  logger.step(`generate changelog`)
  const changelog = await generateChangelog()

  const commitMessage = `release: v${nextVersion}`

  logger.step(`git commit with ${commitMessage}`)
  await exec('git add .')
  await exec(`git commit -m '${commitMessage}'`)

  const tag = `v${nextVersion}`

  logger.step(`git tag ${tag}`)
  await exec(`git tag ${tag}`)

  logger.step(`git push`)
  await exec('git push origin master --tags')

  logger.step(`publish package ${name}`)
  await publishToNpm(nextVersion)

  logger.step('create github release')
  await githubRelease(`${tag}`, changelog, isPrerelease(nextVersion))

  logger.success(`${name}@${nextVersion} 发布完成\n`)
}

async function publishToNpm(nextVersion) {
  const cliArgs = isRcVersion(nextVersion)
    ? 'publish --tag next'
    : isAlphaVersion(nextVersion)
    ? 'publish --tag alpha'
    : isBetaVersion(nextVersion)
    ? 'publish --tag beta'
    : 'publish'
  await exec(`npm ${cliArgs}`)
}

async function githubRelease(tag, body, isPrerelease) {
  const repoUrl = repository ? repository.url : 'https://github.com/kwai-efe/dobux'
  const url = newGithubReleaseUrl({
    repoUrl,
    tag,
    body,
    isPrerelease,
  })

  await open(url)
}

release()
