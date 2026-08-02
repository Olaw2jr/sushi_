import { DEFAULT_THEME } from 'theme';
import { StyleSheet } from 'react-native';
import { Theme } from 'store/theme';
import { COLORS } from 'theme';

const useStyles = (theme: Theme = DEFAULT_THEME) => {
  const colors = COLORS[theme.base];
  const styles = StyleSheet.create({
    container: {
      // Empty Container Style
    },
  });

  const fonts = StyleSheet.create({
    title: {
      fontWeight: '700',
      fontSize: 24,
      color: colors.PRIMARY_TEXT,
    },
    subtitle: {
      fontWeight: '500',
      fontSize: 18,
      letterSpacing: 0.15,
      color: colors.PRIMARY_TEXT,
    },
    body: {
      fontSize: 16,
      letterSpacing: 0.5,
      color: colors.SECONDARY_TEXT,
    },
    label: {
      fontWeight: '600',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: colors.PRIMARY_TEXT,
    },
  });

  return { styles, colors, theme, fonts };
};

export default useStyles;
