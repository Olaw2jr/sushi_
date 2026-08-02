import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'store';

import { SettingsPrivateProps, SettingsPublicProps } from './props';
import SettingsView from './view';
import { setThemeAction, THEME_OPTION } from 'store/theme';
import { setLanguageAction } from 'store/currency';
import { Language, setSelectedLanguageAction } from 'store/language';

const SettingsContainer = (props: SettingsPublicProps) => {
  const dispatch = useDispatch();

  const theme = useAppSelector((state) => state.theme);
  const baseTheme = theme.base;

  const setBaseTheme = (payload: THEME_OPTION) => {
    dispatch(setThemeAction(payload));
  };

  const currency = useAppSelector((state) => state.currency);
  const currencyLanguage = currency.language;

  const setCurrencyLanguage = (payload: string) => {
    dispatch(setLanguageAction(payload));
  };

  const language = useAppSelector((state) => state.language);
  const selectedLanguage = language.selected;

  const setSelectedLanguage = (payload: Language['selected']) => {
    dispatch(setSelectedLanguageAction(payload));
  };

  const generatedProps: SettingsPrivateProps = {
    baseTheme,
    setBaseTheme,
    currencyLanguage,
    setCurrencyLanguage,
    selectedLanguage,
    setSelectedLanguage,
  };

  return <SettingsView {...props} {...generatedProps} />;
};

export default SettingsContainer;
