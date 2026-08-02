import { DEFAULT_THEME } from 'theme';
import { StyleSheet } from 'react-native';
import { Theme } from 'store/theme';
import { getGlobalStyles, COLORS } from 'theme';
import { InfoProps } from './props';

const useStyles = (
  theme: Theme = DEFAULT_THEME,
  status: InfoProps['status'] = 'positive',
) => {
  const colors = COLORS[theme.base];
  const STYLES = getGlobalStyles(theme.base);
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: status === 'negative' ? colors.ERROR : colors.POSITIVE,
    },
  });

  return { styles, colors, theme };
};

export default useStyles;
