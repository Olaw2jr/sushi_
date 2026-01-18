import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from 'components/base/Text/view';
import useStyles from './style';
import { TransactionCardProps } from './props';
import { formatCurrency } from 'utils/formatCurrency';
import { formatDate } from 'utils/formatDate';

const TransactionCard = (props: TransactionCardProps) => {
  const {
    containerStyle = {},
    theme,
    category,
    amount,
    sourceWallet,
    destinationWallet,
    paidAt,
    onPress,
    language,
    description,
  } = props;

  const { styles, colors } = useStyles(theme);

  const config = (() => {
    const defaultConfig = {
      color: colors.PRIMARY_TEXT,
      prefix: '',
    };
    if (destinationWallet) {
      return defaultConfig;
    }

    if (amount > 0) {
      return {
        color: colors.POSITIVE,
        prefix: '+ ',
      };
    }

    if (amount < 0) {
      return {
        color: colors.NEGATIVE,
        prefix: '- ',
      };
    }

    return defaultConfig;
  })();
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.6}>
      {/* <View style={styles.imageContainer}>{Icon}</View> */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text
            containerStyle={styles.rowColumnLeft}
            variant="body"
            style={{ fontWeight: '500' }}
            theme={theme}>
            {category}
          </Text>
          <Text
            containerStyle={styles.rowColumnRight}
            variant="money"
            style={{ color: config.color }}
            theme={theme}>
            {`${config.prefix}${formatCurrency(Math.abs(amount), {
              language,
            })}`}
          </Text>
        </View>
        <View style={styles.row}>
          <Text
            containerStyle={styles.rowColumnLeft}
            variant="label"
            theme={theme}>{`${sourceWallet}${
            destinationWallet ? ` to ${destinationWallet}` : ''
          }`}</Text>
          <Text
            containerStyle={styles.rowColumnRight}
            variant="label"
            style={styles.dateText}
            theme={theme}>
            {formatDate(paidAt, 'hh:mm a')}
          </Text>
        </View>
        {(description || '').length > 0 && (
          <Text
            containerStyle={styles.rowColumnLeft}
            style={{ color: colors.PLACE_HOLDER }}
            variant="body"
            theme={theme}>
            {description as string}
          </Text>
        )}
        {/* {showDate && (
          <Text variant="label" style={styles.dateText} theme={theme}>
            {formatDate(createdAt)}
          </Text>
        )} */}
      </View>
    </TouchableOpacity>
  );
};

export default TransactionCard;
