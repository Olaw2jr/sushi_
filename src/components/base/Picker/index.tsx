import React from 'react';
import useStyles from './style';
import { PickerPrivateProps, PickerProps } from './props';

import PickerView from './view';
import Text from '../Text';
import { useAppSelector } from 'store';
import { TRANSLATIONS } from 'constants/translations';

const Picker = (
  props: Omit<PickerPrivateProps, 'label' | 'renderLabel'> & PickerProps,
) => {
  const { translationKey, ...pickerProps } = props;
  const theme = useAppSelector((state) => state.theme);
  const language = useAppSelector((state) => state.language.selected);
  const { styles } = useStyles(theme);
  return (
    <PickerView
      theme={theme}
      {...pickerProps}
      label={TRANSLATIONS[language][translationKey]}
      renderLabel={() => (
        <Text
          variant="label"
          style={styles.label}
          translationKey={translationKey}
        />
      )}
    />
  );
};

export default Picker;
