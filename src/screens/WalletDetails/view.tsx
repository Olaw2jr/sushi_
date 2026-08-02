import React, { useState } from 'react';
import Text from 'components/base/Text';
import { View, StatusBar, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { WalletDetailsProps } from './props';
import { ChevronLeft, Trash2, Pencil } from 'lucide-react-native';
import { createListItemRenderer } from 'components/module/TransactionCard';
import AlertModal from 'components/module/AlertModal';
import { formatCurrency } from 'utils/formatCurrency';
import { deriveWalletBalance } from 'utils/deriveWalletBalance';
import TextView from 'components/base/Text/view';
import useFilteredTransactions from 'utils/hooks/useFilteredTransactions';
import FilterButton from 'components/module/FilterButton';

const WalletDetailsView = (props: WalletDetailsProps) => {
  const { navigation, wallet, wallets, deleteWallet, language } = props;
  const { styles, theme, colors } = useStyles();

  const { filteredTransactions, dailyFilteredTransactions } =
    useFilteredTransactions({
      accountId: wallet.id,
    });

  const walletTransactions = filteredTransactions.filter(
    (transaction) =>
      transaction.sourceWalletId === wallet.id ||
      transaction.destinationWalletId === wallet.id,
  );

  const { balance: currentBalance, ...balanceBreakdown } = deriveWalletBalance(
    wallet.id,
    wallet.initialAmount,
    walletTransactions,
  );

  const renderTransaction = createListItemRenderer({
    wallets,
    theme,
    language,
    containerStyle: styles.transactionCard,
    onPressItem: (transactionId) =>
      navigation.navigate('TRANSACTION_DETAILS', { transactionId }),
  });

  const [showDelete, setShowDelete] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeftAction}
          onPress={() => {
            navigation.goBack();
          }}>
          <ChevronLeft size={24} color={colors.PRIMARY_TEXT} />
        </TouchableOpacity>
        <Text
          containerStyle={styles.headerTitleContainer}
          variant="title"
          theme={theme}
          translationKey="ACCOUNT_DETAILS"
        />
        <FilterButton
          onPress={() => {
            navigation.navigate('FILTERS');
          }}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.detailsCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.DIVIDER,
            }}>
            <TextView theme={theme} variant="subtitle">
              {wallet.label}
            </TextView>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.headerRightAction}
                onPress={() => {
                  navigation.navigate('EDIT_WALLET', {
                    walletId: wallet.id,
                  });
                }}>
                <Pencil size={24} color={colors.PRIMARY_TEXT} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerRightAction}
                onPress={() => {
                  setShowDelete(true);
                }}>
                <Trash2 size={24} color={colors.PRIMARY_TEXT} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailsCardRow}>
            <Text
              variant="label"
              theme={theme}
              translationKey="CURRENT_BALANCE"
            />
            <TextView variant="subtitle" theme={theme}>
              {formatCurrency(currentBalance, { language })}
            </TextView>
          </View>
          <View style={styles.detailsCardRow}>
            <Text
              variant="label"
              style={{ color: colors.SECONDARY_TEXT }}
              theme={theme}
              translationKey="INITIAL_BALANCE"
            />
            <TextView variant="body" theme={theme}>
              {formatCurrency(wallet.initialAmount, { language })}
            </TextView>
          </View>
          <View style={styles.detailsCardRow}>
            <Text
              variant="label"
              theme={theme}
              style={{ color: colors.SECONDARY_TEXT }}
              translationKey={'DEBIT'}
            />
            <TextView variant="body" theme={theme}>
              {formatCurrency(balanceBreakdown.income, { language })}
            </TextView>
          </View>
          <View style={styles.detailsCardRow}>
            <Text
              variant="label"
              theme={theme}
              style={{ color: colors.SECONDARY_TEXT }}
              translationKey={'CREDIT'}
            />
            <TextView variant="body" theme={theme}>
              {formatCurrency(balanceBreakdown.expenses, { language })}
            </TextView>
          </View>
        </View>
        <View style={styles.transactionsContainer}>
          <SectionList
            contentContainerStyle={styles.contentScroll}
            sections={dailyFilteredTransactions}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { day } }) => (
              <TextView
                variant="subtitle"
                theme={theme}
                style={styles.dateText}>
                {day}
              </TextView>
            )}
            renderItem={({ item }) => renderTransaction({ item: item })}
          />
        </View>
      </View>
      <AlertModal
        titleTranslationKey="DELETE_ACCOUNT"
        descriptionTranslationKey="DELETE_ACCOUNT_INFO"
        descriptionReplacementRecord={{
          accountName: wallet.label,
          transactionCount: walletTransactions.length.toString(),
        }}
        visible={showDelete}
        actions={[
          {
            label: 'Keep',
            onPress: () => {
              setShowDelete(false);
            },
          },
          {
            label: 'Delete',
            onPress: () => {
              setShowDelete(false);
              deleteWallet();
            },
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default WalletDetailsView;
