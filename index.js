import Config from 'react-native-config';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs(true);

// Storybook is required lazily so it's only ever pulled into the running
// app when explicitly requested via the STORYBOOK env var (see
// package.json's android:storybook script).
const Main = Number(Config.STORYBOOK) ? require('./.rnstorybook').default : App;

AppRegistry.registerComponent(appName, () => Main);
