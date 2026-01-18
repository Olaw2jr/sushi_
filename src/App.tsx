import 'react-native-get-random-values';
import './global.css';
import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import Routes from 'screens/Routes';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store, runSaga } from 'infrastracture';
import sagas from 'store/sagas';
import { RootState } from 'store';

runSaga(sagas);

// Inner component that syncs theme with Uniwind
const ThemeSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Sync Redux theme with Uniwind
    if (theme.base === 'Dark') {
      Uniwind.setTheme('dark');
    } else {
      Uniwind.setTheme('light');
    }
  }, [theme.base]);

  return <>{children}</>;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeSyncProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Routes />
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeSyncProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
