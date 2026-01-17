const MODULE_RESOLVER = [
  'module-resolver',
  {
    root: ['./src'],
    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
  },
];

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [MODULE_RESOLVER, 'react-native-reanimated/plugin'],
};
