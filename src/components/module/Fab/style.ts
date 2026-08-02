import { DEFAULT_THEME } from 'theme';
import { StyleSheet } from 'react-native';
import { Theme } from 'store/theme';
import { COLORS } from 'theme';

const FAB_SIZE = 54;

const useStyles = (theme: Theme = DEFAULT_THEME) => {
  const colors = COLORS[theme.base];
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      backgroundColor: colors.PRIMARY,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.PRIMARY,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 6,
    },
  });

  return { styles, colors, theme };
};

export default useStyles;
