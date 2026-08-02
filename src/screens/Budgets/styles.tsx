import { StyleSheet } from 'react-native';
import { useAppSelector } from 'store';
import { getGlobalStyles, COLORS } from 'theme';

const useStyles = () => {
  const theme = useAppSelector((state) => state.theme);
  const colors = COLORS[theme.base];
  const STYLES = getGlobalStyles(theme.base);
  const styles = StyleSheet.create({
    container: STYLES.CONTAINER,
    header: STYLES.HEADER,
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    body: {
      textAlign: 'center',
      marginTop: 8,
    },
  });
  return { styles, colors, theme };
};

export default useStyles;
