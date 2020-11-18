'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/dobux.min.js')
} else {
  module.exports = require('./cjs/dobux.js')
}
