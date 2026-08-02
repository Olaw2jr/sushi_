module.exports = {
  preset: '@react-native/jest-preset',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // immer, react-redux, uuid, and @react-native-async-storage's jest mock
  // all resolve to ESM builds via package "exports" conditions that don't
  // match the RN preset's resolver conditions; extend the preset's default
  // pattern so Jest transforms them instead of choking on `export` syntax.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community|-async-storage)?)/|immer/|react-redux/|uuid/)',
  ],
  collectCoverageFrom: [
    'src/store/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!src/utils/testUtils/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
