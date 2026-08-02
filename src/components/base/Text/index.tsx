import React from 'react';
import { TextPrivateProps, TextProps } from './props';
import TextView from './view';
import { useAppSelector } from 'store';
import { TRANSLATIONS } from 'constants/translations';

const Text = (props: Omit<TextPrivateProps, 'children'> & TextProps) => {
  const { translationKey, ...textProps } = props;
  const theme = useAppSelector((state) => state.theme);
  const language = useAppSelector((state) => state.language.selected);

  return (
    <TextView theme={theme} {...textProps}>
      {TRANSLATIONS[language][translationKey]}
    </TextView>
  );
};

export default Text;
