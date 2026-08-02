import { StatusBarStyle } from 'react-native';

const LIGHT = {
  PRIMARY: '#c1512f',
  ACCENT_SOFT: '#c1512f1a',
  POSITIVE: '#3f7a5c',
  NEGATIVE: '#a8412f',
  ON_ACCENT: '#fbf3ee',
  TITLE: '#1a1917',
  PRIMARY_TEXT: '#1a1917',
  SECONDARY_TEXT: '#79746a',
  DISABLE: '#d9d4c8',
  BORDER: '#e7e2d8',
  DIVIDER: '#e7e2d8',
  PLACE_HOLDER: '#79746a',
  BACKGROUND: '#ffffff',
  AREA_HIGHLIGHT: '#faf9f5',
  ERROR: '#a8412f',
  STATUS_BAR: 'dark-content' as StatusBarStyle,
};

export const DARK = {
  PRIMARY: '#e07a52',
  ACCENT_SOFT: '#e07a5230',
  POSITIVE: '#6bbf95',
  NEGATIVE: '#e0847a',
  ON_ACCENT: '#1c1310',
  TITLE: '#f3f0ea',
  PRIMARY_TEXT: '#f3f0ea',
  SECONDARY_TEXT: '#a39c8f',
  DISABLE: '#4a453d',
  BORDER: '#332f29',
  DIVIDER: '#332f29',
  PLACE_HOLDER: '#a39c8f',
  BACKGROUND: '#1c1b18',
  AREA_HIGHLIGHT: '#211f1c',
  ERROR: '#e0847a',
  STATUS_BAR: 'light-content' as StatusBarStyle,
};

export default {
  LIGHT,
  DARK,
  Light: LIGHT,
  Dark: DARK,
};
