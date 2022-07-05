// https://jestjs.io/docs/configuration
module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/scripts/setupJestEnv.ts'],
  rootDir: __dirname,
  globals: {
    __DEV__: true,
    __TEST__: true,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    __VERSION__: require('./package.json').version,
    __GLOBAL__: false,
    __ESM__: true,
    __NODE_JS__: true,
    'ts-jest': {
      tsconfig: {
        // https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
        target: 'es2019',
        sourceMap: true,
      },
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['<rootDir>/__tests__/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/examples/__tests__'],
}
