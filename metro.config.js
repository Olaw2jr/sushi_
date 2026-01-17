const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = withStorybook(defaultConfig);

// Ensure the experimental feature is enabled on the final configuration object
config.transformer.unstable_allowRequireContext = true;

module.exports = config;