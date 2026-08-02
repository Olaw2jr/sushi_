import { DEFAULT_THEME } from 'theme';
import { StyleSheet } from 'react-native';
import { Theme } from 'store/theme';
import { COLORS } from 'theme';

const BUTTON_HEIGHT = 40;

const useStyles = (theme: Theme = DEFAULT_THEME) => {
  const colors = COLORS[theme.base];
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.PRIMARY,
      height: BUTTON_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      flexDirection: 'row',
    },
    containerDisabled: {
      backgroundColor: colors.DISABLE,
    },
    text: {
      fontWeight: '600',
      fontSize: 14,
      color: colors.ON_ACCENT,
      letterSpacing: 0.2,
    },
    outlineContainer: {
      backgroundColor: 'transparent',
      height: BUTTON_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      borderColor: colors.PRIMARY,
      borderWidth: 1.5,
      flexDirection: 'row',
    },
    outlineContainerDisabled: {
      borderColor: colors.DISABLE,
    },
    outlineText: {
      fontWeight: '600',
      fontSize: 14,
      color: colors.PRIMARY_TEXT,
      letterSpacing: 0.2,
    },
    loadingContainer: {
      marginLeft: 8,
    },
  });

  return { styles, colors, theme };
};

export default useStyles;
