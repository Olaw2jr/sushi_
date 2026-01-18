import { StatusBarStyle } from 'react-native';

const LIGHT = {
  PRIMARY: '#e15f41',
  POSITIVE: '#218c74',
  NEGATIVE: '#b33939',
  TITLE: '#1f1f1f',
  PRIMARY_TEXT: '#434343',
  SECONDARY_TEXT: '#595959',
  DISABLE: '#bfbfbf',
  BORDER: '#d9d9d9',
  DIVIDER: '#f0f0f0',
  PLACE_HOLDER: '#8c8c8c',
  BACKGROUND: '#f5f5f5',
  AREA_HIGHLIGHT: '#fafafa',
  ERROR: '#c44569',
  STATUS_BAR: 'dark-content' as StatusBarStyle,
};

export const DARK = {
  PRIMARY: '#e15f41',
  POSITIVE: '#33d9b2',
  NEGATIVE: '#ff5252',
  TITLE: '#fafafa',
  PRIMARY_TEXT: '#f5f5f5',
  SECONDARY_TEXT: '#d9d9d9',
  DISABLE: '#d9d9d9',
  BORDER: '#bfbfbf',
  DIVIDER: '#595959',
  PLACE_HOLDER: '#595959',
  BACKGROUND: '#1f1f1f',
  AREA_HIGHLIGHT: '#141414',
  ERROR: '#c44569',
  STATUS_BAR: 'light-content' as StatusBarStyle,
};

export const WASABI = {
  PRIMARY: '#4E6C50',
  POSITIVE: '#4E6C50',
  NEGATIVE: '#AA8B56',
  TITLE: '#1b251c',
  PRIMARY_TEXT: '#434343',
  SECONDARY_TEXT: '#595959',
  DISABLE: '#bfbfbf',
  BORDER: '#d9d9d9',
  DIVIDER: '#f0f0f0',
  PLACE_HOLDER: '#8c8c8c',
  BACKGROUND: '#e9efea',
  AREA_HIGHLIGHT: '#eef3ee',
  ERROR: '#c44569',
  STATUS_BAR: 'dark-content' as StatusBarStyle,
};

export const SUSHI_2 = {
  PRIMARY: '#1c1917', // stone-900
  POSITIVE: '#16a34a', // green-600
  NEGATIVE: '#dc2626', // red-600
  TITLE: '#1c1917',
  PRIMARY_TEXT: '#1c1917',
  SECONDARY_TEXT: '#78716c', // stone-500
  DISABLE: '#d6d3d1', // stone-300
  BORDER: '#e7e5e4', // stone-200
  DIVIDER: '#f5f5f4', // stone-100
  PLACE_HOLDER: '#a8a29e', // stone-400
  BACKGROUND: '#fafaf9', // stone-50
  AREA_HIGHLIGHT: '#ffffff',
  ERROR: '#ef4444', // red-500
  STATUS_BAR: 'dark-content' as StatusBarStyle,
};

export default {
  LIGHT,
  DARK,
  Light: LIGHT,
  Dark: DARK,
  WASABI,
  Wasabi: WASABI,
  SUSHI_2,
};
