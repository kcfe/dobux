const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const conventionalChangelog = require('conventional-changelog')

const config = require('./conventional-changelog-config')
const logger = require('./utils/logger')

const cwd = process.cwd()
const CHANGELOG = path.join(cwd, 'CHANGELOG.md')
const LATEST_LOG = path.join(cwd, 'LATESTLOG.md')

async function generateChangelog() {
  let hasError = false

  return new Promise((resolve, reject) => {
    const stream = conventionalChangelog({
      config,
    })

    let changelog = ''
    let latestLog = ''

    stream.on('data', chunk => {
      try {
        const data = chunk.toString()

        if (fs.existsSync(CHANGELOG)) {
          changelog = fs
            .readFileSync(CHANGELOG, 'utf8')
            .replace(/# Change Log/, '# Change Log \n\n' + data)
        } else {
          changelog = '# Change Log \n\n' + data
        }

        fs.writeFileSync(CHANGELOG, changelog)

        const lines = data.split(os.EOL)
        let firstIndex = -1

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]

          if (/^#{1,3}/.test(line)) {
            firstIndex = i
            break
          }
        }

        if (firstIndex > -1) {
          latestLog = data.replace(/^##* \[[^\]]+\]/, '## [Changes]')

          fs.writeFileSync(LATEST_LOG, latestLog)
          logger.success(`成功将 ${LATEST_LOG} 文件生成到 ${cwd} 目录下`)
        }
      } catch (err) {
        hasError = true
        reject(err.stack)
      }
    })

    stream.on('error', err => {
      if (hasError) {
        return
      }

      hasError = true
      reject(err.stack)
    })

    stream.on('end', () => {
      if (hasError) {
        return
      }

      logger.success(`成功将 ${CHANGELOG} 文件生成到 ${cwd} 目录下`)
      resolve(latestLog)
    })
  })
}

module.exports = generateChangelog
