import React from 'react';
import { ButtonPrivateProps, ButtonProps } from './props';
import { TRANSLATIONS } from 'constants/translations';
import { useAppSelector } from 'store';
import ButtonView from 'components/base/Button/view';

const Button = (props: Omit<ButtonPrivateProps, 'label'> & ButtonProps) => {
  const { translationKey, ...buttonProps } = props;

  const theme = useAppSelector((state) => state.theme);
  const language = useAppSelector((state) => state.language.selected);

  return (
    <ButtonView
      theme={theme}
      {...buttonProps}
      label={TRANSLATIONS[language][translationKey]}
    />
  );
};

export default Button;
