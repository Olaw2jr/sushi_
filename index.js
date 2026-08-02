import Config from 'react-native-config';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs(true);

// Storybook is required lazily so a broken/unported storybook module can't
// take down the real app's boot — it's only ever needed when explicitly
// requested via the STORYBOOK env var (see package.json's
// android:storybook script).
const Main = Number(Config.STORYBOOK) ? require('./storybook').default : App;

AppRegistry.registerComponent(appName, () => Main);
