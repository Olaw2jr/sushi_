import { ViewStyle, TextStyle, TextProps as RNTextProps } from 'react-native';
import { Theme } from 'store/theme';
import { TranslationKey } from 'types/Translation';

export interface TextPrivateProps extends RNTextProps {
  containerStyle?: ViewStyle;
  containerClassName?: string;
  style?: TextStyle;
  className?: string;
  variant?: 'title' | 'subtitle' | 'body' | 'label' | 'sectionTitle' | 'money' | 'moneyLg';
  children: string;
  theme?: Theme;
}

export type TextProps = {
  translationKey: TranslationKey;
};
