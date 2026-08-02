import languageReducer, { setSelectedLanguageAction } from './language';

describe('language', () => {
  test('setSelectedLanguage updates the selected language', () => {
    const state = languageReducer(
      { selected: 'en-US' },
      setSelectedLanguageAction('de-DE'),
    );

    expect(state).toEqual({ selected: 'de-DE' });
  });
});
