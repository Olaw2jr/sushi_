import React from 'react';
import { ViewStyle } from 'react-native';
import { Theme } from 'store/theme';
import { TranslationKey } from 'types/Translation';

export interface PickerPrivateProps {
  containerStyle?: ViewStyle;
  theme?: Theme;
  options: {
    label: string;
    value: string;
  }[];
  onSelect?: (value: string | null) => void;
  selectedValue?: string;
  label?: string;
  renderLabel?: () => React.ReactNode;
  renderActionButton?: (onPress: () => void) => React.ReactNode;
  placeholder?: string;
}

export type PickerProps = {
  translationKey: TranslationKey;
};
