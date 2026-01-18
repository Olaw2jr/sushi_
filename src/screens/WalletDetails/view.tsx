import React, { useState } from 'react';
import { View, StatusBar, TouchableOpacity, SectionList, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Smartphone,
  Landmark,
  TrendingUp,
  Shield,
  Home,
  CreditCard,
  Wallet,
  Calendar,
  Percent,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  ArrowLeft,
  Trash2,
  Pencil,
  Plus
} from 'lucide-react-native';
import useStyles from './styles';
import { WalletDetailsProps } from './props';
import { Transaction } from 'store/transactions';
import TransactionCard from 'components/module/TransactionCard';
import AlertModal from 'components/module/AlertModal';
import { formatCurrency } from 'utils/formatCurrency';
import TextView from 'components/base/Text/view';
import useFilteredTransactions from 'utils/hooks/useFilteredTransactions';
import FilterButton from 'components/module/FilterButton';
import Card from 'components/base/Card';
import { formatDate } from 'utils/formatDate';
import { AccountType } from 'constants/enums';

const StatCard = ({ icon: Icon, label, value, subValue, colors, theme, variant = 'default' }: any) => {
    const valueColor = variant === 'danger' ? colors.NEGATIVE : variant === 'success' ? colors.POSITIVE : colors.PRIMARY_TEXT;
    return (
        <View style={{ flex: 1, padding: 12, backgroundColor: colors.AREA_HIGHLIGHT, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ padding: 6, borderRadius: 8, backgroundColor: colors.BORDER + '40' }}>
                    <Icon size={14} color={colors.SECONDARY_TEXT} />
                </View>
                <TextView variant="label" style={{ fontSize: 9 }} theme={theme}>{label}</TextView>
            </View>
            <TextView variant="money" style={{ color: valueColor }} theme={theme}>{value}</TextView>
            {subValue && <TextView variant="label" style={{ fontSize: 8, color: colors.PLACE_HOLDER, marginTop: 2, textTransform: 'none' }} theme={theme}>{subValue}</TextView>}
        </View>
    );
};

const WalletDetailsView = (props: WalletDetailsProps) => {
  const { navigation, wallet, wallets, deleteWallet, language } = props;
  const { styles, theme, colors } = useStyles();
  const valuations = useSelector((state: RootState) => state.valuations);

  const walletValuations = Object.values(valuations)
    .filter(v => v.assetId === wallet.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const { filteredTransactions, dailyFilteredTransactions } =
    useFilteredTransactions({
      accountId: wallet.id,
    });

  const walletTransactions = filteredTransactions.filter(
    (transaction) =>
      transaction.sourceWalletId === wallet.id ||
      transaction.destinationWalletId === wallet.id,
  );

  const [showDelete, setShowDelete] = useState(false);

  const renderTypeSpecificMetrics = () => {
    switch (wallet.type) {
        case AccountType.LOAN: {
            const original = wallet.initialAmount || 0;
            const remaining = wallet.balance || original;
            const paidAmount = Math.abs(original) - Math.abs(remaining);
            const paidPercent = original !== 0 ? (paidAmount / Math.abs(original)) * 100 : 0;
            return (
                <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <StatCard icon={CreditCard} label="REMAINING" value={formatCurrency(remaining, { language })} colors={colors} theme={theme} variant="danger" />
                        <StatCard icon={Wallet} label="ORIGINAL" value={formatCurrency(original, { language })} colors={colors} theme={theme} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <StatCard icon={Percent} label="INTEREST" value={`${wallet.interestRate || 0}% p.a.`} colors={colors} theme={theme} />
                        <StatCard icon={TrendingUp} label="PAID OFF" value={`${paidPercent.toFixed(1)}%`} subValue={formatCurrency(paidAmount, { language })} colors={colors} theme={theme} variant="success" />
                    </View>
                    <View style={{ padding: 16, backgroundColor: colors.AREA_HIGHLIGHT, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <TextView variant="label" theme={theme}>REPAYMENT PROGRESS</TextView>
                            <TextView variant="label" style={{ color: colors.PRIMARY_TEXT }} theme={theme}>{paidPercent.toFixed(1)}%</TextView>
                        </View>
                        <View style={{ height: 6, backgroundColor: colors.BORDER, borderRadius: 3, overflow: 'hidden' }}>
                            <View style={{ height: '100%', width: `${Math.min(paidPercent, 100)}%`, backgroundColor: colors.POSITIVE }} />
                        </View>
                    </View>
                </View>
            );
        }
        case AccountType.CREDIT_CARD: {
            const limit = wallet.creditLimit || 0;
            const outstanding = Math.abs(wallet.balance || 0);
            const utilization = limit > 0 ? (outstanding / limit) * 100 : 0;
            return (
                <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <StatCard icon={CreditCard} label="OUTSTANDING" value={formatCurrency(outstanding, { language })} colors={colors} theme={theme} variant="danger" />
                        <StatCard icon={Wallet} label="AVAILABLE" value={formatCurrency(wallet.availableCredit || 0, { language })} colors={colors} theme={theme} variant="success" />
                    </View>
                    <View style={{ padding: 16, backgroundColor: colors.AREA_HIGHLIGHT, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <TextView variant="label" theme={theme}>CREDIT UTILIZATION</TextView>
                            <TextView variant="label" style={{ color: colors.PRIMARY_TEXT }} theme={theme}>{utilization.toFixed(0)}%</TextView>
                        </View>
                        <View style={{ height: 6, backgroundColor: colors.BORDER, borderRadius: 3, overflow: 'hidden' }}>
                            <View style={{ height: '100%', width: `${Math.min(utilization, 100)}%`, backgroundColor: utilization > 70 ? colors.NEGATIVE : colors.PRIMARY }} />
                        </View>
                    </View>
                </View>
            );
        }
        default:
            return (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <StatCard icon={Wallet} label="BALANCE" value={formatCurrency(wallet.balance || wallet.initialAmount, { language })} colors={colors} theme={theme} />
                    <StatCard icon={Target} label="STATUS" value={wallet.onBudget ? "On Budget" : "Off Budget"} colors={colors} theme={theme} />
                </View>
            );
    }
  };

  const renderTransaction = ({ item: transaction }: { item: Transaction }) => {
    const sourceWallet = wallets[transaction.sourceWalletId];
    const destinationWallet = transaction.destinationWalletId
      ? wallets[transaction.destinationWalletId]
      : null;
    return (
      <TransactionCard
        containerStyle={styles.transactionCard}
        key={transaction.id}
        category={transaction.category}
        amount={transaction.amount}
        sourceWallet={sourceWallet?.label || ''}
        destinationWallet={destinationWallet?.label}
        paidAt={transaction.paidAt}
        onPress={() =>
          navigation.navigate('TRANSACTION_DETAILS', {
            transactionId: transaction.id,
          })
        }
        theme={theme}
        language={language}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={[styles.header, { borderBottomColor: colors.BORDER, paddingVertical: 20 }]}>
        <TouchableOpacity
          style={styles.headerLeftAction}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
        </TouchableOpacity>
        <TextView
          style={styles.headerTitleContainer}
          variant="title"
          theme={theme}>
            {wallet.label}
        </TextView>
        <FilterButton
          onPress={() => {
            navigation.navigate('FILTERS');
          }}
        />
      </View>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ padding: 24, gap: 32 }}>
            {/* Main Metrics */}
            {renderTypeSpecificMetrics()}

            {/* General Details */}
            <Card style={{ backgroundColor: colors.AREA_HIGHLIGHT, gap: 20, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextView variant="label" theme={theme}>ACCOUNT TYPE</TextView>
                    <TextView variant="body" style={{ fontWeight: '600' }} theme={theme}>{wallet.type}</TextView>
                </View>
                {wallet.accountNumber && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextView variant="label" theme={theme}>NUMBER</TextView>
                        <TextView variant="body" theme={theme}>{wallet.accountNumber}</TextView>
                    </View>
                )}
                <View style={{ height: 1, backgroundColor: colors.DIVIDER, marginVertical: 8 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}
                        onPress={() => navigation.navigate('EDIT_WALLET', { walletId: wallet.id })}>
                        <Pencil size={18} color={colors.PRIMARY} />
                        <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>EDIT</TextView>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}
                        onPress={() => setShowDelete(true)}>
                        <Trash2 size={18} color={colors.NEGATIVE} />
                        <TextView variant="label" style={{ color: colors.NEGATIVE }} theme={theme}>DELETE</TextView>
                    </TouchableOpacity>
                </View>
            </Card>
        </View>

        {/* Valuation History */}
        <View style={{ marginBottom: 48 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 }}>
            <TextView variant="sectionTitle" theme={theme}>VALUATION HISTORY</TextView>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ADD_VALUATION', { walletId: wallet.id })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Plus size={16} color={colors.PRIMARY} />
              <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>ADD</TextView>
            </TouchableOpacity>
          </View>
          
          {walletValuations.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
              {walletValuations.map((v) => (
                <Card key={v.id} style={{ marginRight: 16, minWidth: 160, padding: 16 }}>
                  <TextView variant="label" style={{ fontSize: 10, color: colors.PLACE_HOLDER }} theme={theme}>
                    {formatDate(v.date)}
                  </TextView>
                  <TextView variant="money" style={{ marginTop: 8 }} theme={theme}>
                    {formatCurrency(v.value || 0, { language })}
                  </TextView>
                  {v.note && (
                    <TextView style={{ fontSize: 11, color: colors.SECONDARY_TEXT, marginTop: 8 }} numberOfLines={2} theme={theme}>
                      {v.note}
                    </TextView>
                  )}
                </Card>
              ))}
            </ScrollView>
          ) : (
            <View style={{ paddingHorizontal: 24 }}>
              <TextView variant="body" style={{ fontSize: 14, color: colors.PLACE_HOLDER }} theme={theme}>
                No valuation history recorded.
              </TextView>
            </View>
          )}
        </View>

        <View style={[styles.transactionsContainer, { marginHorizontal: 24, borderRadius: 16, borderTopWidth: 1, borderTopColor: colors.BORDER, paddingTop: 32, paddingBottom: 16 }]}>
            <TextView variant="sectionTitle" style={{ marginBottom: 24, paddingHorizontal: 16 }} theme={theme}>HISTORY</TextView>
            <SectionList
                scrollEnabled={false}
                sections={dailyFilteredTransactions}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section: { day } }) => (
                <TextView
                    variant="label"
                    theme={theme}
                    style={{ color: colors.PLACE_HOLDER, marginVertical: 16, paddingHorizontal: 16 }}>
                    {day}
                </TextView>
                )}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 16 }}>
                        {renderTransaction({ item: item })}
                    </View>
                )}
            />
        </View>
      </ScrollView>
      <AlertModal
        theme={theme}
        titleTranslationKey="DELETE_ACCOUNT"
        descriptionTranslationKey="DELETE_ACCOUNT_INFO"
        descriptionReplacementRecord={{
          accountName: wallet.label,
          transactionCount: walletTransactions.length.toString(),
        }}
        visible={showDelete}
        actionTranslationKeys={['KEEP', 'DELETE']}
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