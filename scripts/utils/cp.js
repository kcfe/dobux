const cp = require('child_process')

exports.exec = (cmd, options = {}, output = {}) => {
  if (!options.maxBuffer) {
    options.maxBuffer = 2 * 1024 * 1024
  }

  return new Promise((resolve, reject) => {
    cp.exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        output.stdout = stdout.toString()
        output.stderr = stderr.toString()

        resolve(stdout || stderr)
      }
    })
  })
}

exports.spawn = (bin, args, options) => {
  return new Promise((resolve, reject) => {
    const child = cp.spawn(bin, args, options)
    let hasError = false

    // 子进程出现 error 事件时, exit 可能会触发, 也可能不会
    child.once('error', err => {
      hasError = true
      reject(err)
    })

    child.once('exit', code => {
      if (hasError) {
        return
      }

      if (code) {
        reject(new Error(`failed to exec command ${bin} the code is ${code}`))
      } else {
        resolve(code)
      }
    })
  })
}
