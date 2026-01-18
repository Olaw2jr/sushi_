import { StyleSheet } from 'react-native';
import { Theme } from 'store/theme';
import { COLORS } from 'theme';

const useStyles = (theme: Theme) => {
  const colors = COLORS[theme.base];
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    media: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.AREA_HIGHLIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      textAlign: 'center',
      color: colors.SECONDARY_TEXT,
    },
    content: {
      width: '100%',
      alignItems: 'center',
      gap: 12,
    },
  });
};

export default useStyles;
