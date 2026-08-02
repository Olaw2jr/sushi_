import { Appearance } from 'react-native';

describe('theme', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test('initial state defaults to Dark when the OS scheme is dark', () => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('dark');
    const themeReducer = require('./theme').default;

    expect(themeReducer(undefined, { type: '@@INIT' })).toEqual({
      base: 'Dark',
    });
  });

  test('initial state defaults to Light when the OS scheme is not dark', () => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');
    const themeReducer = require('./theme').default;

    expect(themeReducer(undefined, { type: '@@INIT' })).toEqual({
      base: 'Light',
    });
  });

  test('setTheme updates the base theme', () => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');
    const { default: themeReducer, setThemeAction } = require('./theme');

    const state = themeReducer({ base: 'Light' }, setThemeAction('Dark'));

    expect(state).toEqual({ base: 'Dark' });
  });
});
