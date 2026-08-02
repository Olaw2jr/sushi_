import { renderHookWithStore } from 'utils/testUtils/renderHookWithStore';
import useTranslationKey from './useTranslationKey';

describe('useTranslationKey', () => {
  test('resolves translation keys for the selected language', () => {
    const { result } = renderHookWithStore(
      () => useTranslationKey(['SETTINGS', 'THEME']),
      { language: { selected: 'en-US' } },
    );

    expect(result.current).toEqual(['Settings', 'Theme']);
  });

  test('resolves translation keys for a non-default selected language', () => {
    const { result } = renderHookWithStore(
      () => useTranslationKey(['SETTINGS', 'THEME']),
      { language: { selected: 'de-DE' } },
    );

    expect(result.current).toEqual(['Einstellungen', 'Thema']);
  });
});
