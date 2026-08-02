import { DEFAULT_THEME } from 'theme';
import { StyleSheet } from 'react-native';
import { Theme } from 'store/theme';
import { COLORS } from 'theme';

const useStyles = (theme: Theme = DEFAULT_THEME) => {
  const colors = COLORS[theme.base];
  // const STYLES = getGlobalStyles(theme.base);
  const styles = StyleSheet.create({
    container: {},
    inputContainer: {
      marginTop: 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
      paddingVertical: 8,
      paddingHorizontal: 0,
      height: 50,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      color: colors.PRIMARY_TEXT,
    },
    value: {
      fontSize: 16,
      letterSpacing: 0.5,
      color: colors.PRIMARY_TEXT,
    },
    modalContainer: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      backgroundColor: '#00000022',
    },
    modalTitle: {
      color: colors.TITLE,
    },
    modalContentArea: {
      backgroundColor: colors.AREA_HIGHLIGHT,
      padding: 16,
      borderRadius: 10,
      maxHeight: '50%',
    },
    modalTitleContainer: {
      padding: 16,
      flexDirection: 'row',
    },
    modalTitleTextContainer: {
      flex: 1,
    },
    modalTitleAction: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalItemContainer: {
      padding: 16,
    },
    modalItemLabel: {
      color: colors.PRIMARY_TEXT,
    },
    modalItemLabelActive: {
      color: colors.PRIMARY,
    },
  });

  return { styles, colors, theme };
};

export default useStyles;
