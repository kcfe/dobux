// https://jestjs.io/docs/en/configuration#defaults
module.exports = {
  roots: ['<rootDir>'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  testRegex: 'test/(.+)\\.spec\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}
