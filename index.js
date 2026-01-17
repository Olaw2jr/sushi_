/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import Config from 'react-native-config';
import App from './src/App';
import Storybook from './.rnstorybook';
import { name as appName } from './app.json';

const showStorybook = Config?.STORYBOOK && Number(Config.STORYBOOK) === 1;
const Main = showStorybook ? Storybook : App;

console.log('Config loaded:', Config);

AppRegistry.registerComponent(appName, () => Main);
