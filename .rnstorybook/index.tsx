import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

const StorybookWithSplash = () => {
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);
  return <StorybookUIRoot />;
};

export default StorybookWithSplash;