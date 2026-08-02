import { THEME_OPTION } from 'store/theme';
import { Language } from 'store/language';
import { TabScreenProps } from 'types/Route';

export interface SettingsPublicProps extends TabScreenProps<'SETTINGS'> {}

export interface SettingsPrivateProps {
  baseTheme: string;
  setBaseTheme: (payload: THEME_OPTION) => void;
  currencyLanguage: string;
  setCurrencyLanguage: (payload: string) => void;
  selectedLanguage: Language['selected'];
  setSelectedLanguage: (payload: Language['selected']) => void;
}

export interface SettingsProps
  extends SettingsPublicProps,
    SettingsPrivateProps {}
