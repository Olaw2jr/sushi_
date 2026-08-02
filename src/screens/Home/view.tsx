import React, { useState } from 'react';
import Text from 'components/base/Text';
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { HomeProps } from './props';
import WalletCard from 'components/module/WalletCard';
import { BarChart3, Settings } from 'lucide-react-native';
import { createListItemRenderer } from 'components/module/TransactionCard';
import { formatCurrency } from 'utils/formatCurrency';
import { deriveWalletBalance } from 'utils/deriveWalletBalance';
import TextView from 'components/base/Text/view';
import { Translation } from 'types/Translation';
import Button from 'components/base/Button';
import useTranslationKey from 'utils/hooks/useTranslationKey';
import useFilteredTransactions from 'utils/hooks/useFilteredTransactions';
import FilterButton from 'components/module/FilterButton';

const SubHeader = (props: {
  label: keyof Translation;
  action?: () => void;
  actionText?: keyof Translation;
}) => {
  const { styles, theme } = useStyles();
  return (
    <View style={styles.contentHeader}>
      <Text variant="subtitle" theme={theme} translationKey={props.label} />

      {!!props.actionText && (
        <TouchableOpacity onPress={props.action}>
          <Text
            variant="label"
            style={styles.contentHeaderAction}
            theme={theme}
            translationKey={props.actionText}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const HomeView = (props: HomeProps) => {
  const { navigation, wallets, transactions, language } = props;
  const { styles, theme, colors } = useStyles();

  const { filteredTransactions, dailyFilteredTransactions } =
    useFilteredTransactions();

  const recentTransactions = dailyFilteredTransactions.slice(0, 3);

  const balanceBreakdown = filteredTransactions.reduce(
    (accum, transaction) => {
      // ignore transfers on calculation
      if (!transaction.destinationWalletId) {
        if (transaction.amount > 0) {
          return {
            income: accum.income + Math.abs(transaction.amount),
            expenses: accum.expenses,
          };
        } else if (transaction.amount < 0) {
          return {
            income: accum.income,
            expenses: accum.expenses + Math.abs(transaction.amount),
          };
        }
      }
      return {
        income: accum.income,
        expenses: accum.expenses,
      };
    },
    {
      income: 0,
      expenses: 0,
    },
  );

  const walletsArray = Object.keys(wallets).map((key) => wallets[key]);
  const totalInitialBalance = walletsArray.reduce((accum, wallet) => {
    return accum + wallet.initialAmount;
  }, 0);
  const currentBalance =
    totalInitialBalance + balanceBreakdown.income - balanceBreakdown.expenses;

  const renderTransaction = createListItemRenderer({
    wallets,
    theme,
    language,
    containerStyle: styles.transactionCard,
    onPressItem: (transactionId) =>
      navigation.navigate('TRANSACTION_DETAILS', { transactionId }),
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={styles.header}>
        <View style={styles.headerActionContainer}>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.headerActionContainer,
              {
                width: 40,
                height: 40,
                borderColor: colors.DIVIDER,
                borderWidth: 1,
                borderRadius: 20,
              },
            ]}
            onPress={() => {
              navigation.navigate('INSIGHTS');
            }}>
            <BarChart3 size={20} color={colors.PRIMARY_TEXT} />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContainer}>
          <TextView variant="title" theme={theme}>
            {formatCurrency(currentBalance, { language })}
          </TextView>
        </View>
        <FilterButton
          onPress={() => {
            navigation.navigate('FILTERS');
          }}
        />
        <TouchableOpacity
          style={styles.headerActionContainer}
          onPress={() => {
            navigation.navigate('SETTINGS');
          }}>
          <Settings size={24} color={colors.PRIMARY_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View>
          <SubHeader label="MY_ACCOUNTS" />
          <View style={styles.walletsScrollContainer}>
            <ScrollView
              contentContainerStyle={styles.contentScroll}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {walletsArray.map((wallet) => {
                const walletTransactions = filteredTransactions.filter(
                  (transaction) =>
                    transaction.sourceWalletId === wallet.id ||
                    transaction.destinationWalletId === wallet.id,
                );
                const { balance: currentWalletBalance } = deriveWalletBalance(
                  wallet.id,
                  wallet.initialAmount,
                  walletTransactions,
                );
                return (
                  <WalletCard
                    containerStyle={styles.walletCard}
                    key={wallet.id}
                    label={wallet.label}
                    balance={currentWalletBalance}
                    onPress={() =>
                      navigation.navigate('WALLET_DETAILS', {
                        walletId: wallet.id,
                      })
                    }
                    theme={theme}
                    language={language}
                  />
                );
              })}

              <WalletCard
                containerStyle={styles.walletCard}
                key={'create_wallet'}
                label={''}
                balance={0}
                onPress={() => navigation.navigate('CREATE_WALLET')}
                template
                theme={theme}
                language={language}
              />
            </ScrollView>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <SubHeader
            label="RECENT_TRANSACTIONS"
            actionText="SHOW_ALL"
            action={() => {
              navigation.navigate('TRANSACTIONS');
            }}
          />
          <SectionList
            scrollEnabled={false}
            contentContainerStyle={styles.contentScroll}
            sections={recentTransactions}
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
        <View style={{ height: 32 }} />
      </ScrollView>
      <View style={styles.actionsContainer}>
        <Button
          outline
          onPress={() => navigation.navigate('CREATE_TRANSACTION')}
          translationKey="NEW_TRANSACTION"
          theme={theme}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeView;
