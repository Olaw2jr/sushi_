import currencyReducer, { setLanguageAction } from './currency';

describe('currency', () => {
  test('setLanguage updates the language', () => {
    const state = currencyReducer(
      { language: 'en-US' },
      setLanguageAction('fil-PH'),
    );

    expect(state).toEqual({ language: 'fil-PH' });
  });
});
