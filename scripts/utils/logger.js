const chalk = require('chalk')

function info(message) {
  console.log(message)
}

function warn(message) {
  console.log(chalk.yellowBright(message))
}

function error(message) {
  console.log(chalk.redBright(message))
}

function success(message) {
  console.log(chalk.greenBright(message))
}

function printErrorAndExit(message) {
  console.error(error(message))
  process.exit(1)
}

function step(name) {
  console.log(`${chalk.gray('>>> Release:')} ${chalk.magenta.bold(name)}`)
}

module.exports = {
  info,
  warn,
  error,
  success,
  printErrorAndExit,
  step,
}
