import { ViewStyle } from 'react-native';
import { Theme } from 'store/theme';
import { Translation } from 'types/Translation';

export interface InfoProps {
  containerStyle?: ViewStyle;
  theme?: Theme;
  label?: string;
  translationKey?: keyof Translation;
  replacementRecord?: Record<string, string>;
}
