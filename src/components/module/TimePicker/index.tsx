import React from 'react';
import { TimePickerPrivateProps, TimePickerProps } from './props';

import { useAppSelector } from 'store';
import { TRANSLATIONS } from 'constants/translations';
import TimePickerView from './view';

const TimePicker = (
  props: Omit<TimePickerPrivateProps, 'label'> & TimePickerProps,
) => {
  const { labelTranslationKey, ...timePickerProps } = props;
  const theme = useAppSelector((state) => state.theme);
  const language = useAppSelector((state) => state.language.selected);
  return (
    <TimePickerView
      theme={theme}
      label={TRANSLATIONS[language][labelTranslationKey]}
      {...timePickerProps}
    />
  );
};

export default TimePicker;
