import { ViewStyle } from 'react-native';
import { Theme } from 'store/theme';

export interface FabProps {
  containerStyle?: ViewStyle;
  theme?: Theme;
  onPress?: () => void;
}
