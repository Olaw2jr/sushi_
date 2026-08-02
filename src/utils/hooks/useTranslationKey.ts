import { TRANSLATIONS } from 'constants/translations';
import { useAppSelector } from 'store';
import { TranslationKey } from 'types/Translation';

const useTranslationKey = (translationKeys: TranslationKey[]) => {
  const language = useAppSelector((state) => state.language.selected);
  const translations = TRANSLATIONS[language];

  return translationKeys.map((k) => translations[k]);
};

export default useTranslationKey;
