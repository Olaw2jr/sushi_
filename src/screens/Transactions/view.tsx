import React, { useEffect, useState } from 'react';
import Text from 'components/base/Text';
import { View, StatusBar, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { TransactionsProps } from './props';
import { ArrowLeft, Check, Plus } from 'lucide-react-native';
import { Transaction } from 'store/transactions';
import TextView from 'components/base/Text/view';
import { formatDate } from 'utils/formatDate';
import { formatCurrency } from 'utils/formatCurrency';
import useFilteredTransactions from 'utils/hooks/useFilteredTransactions';
import FilterButton from 'components/module/FilterButton';
import { TransactionStatus, TransactionKind } from 'constants/enums';
import { TRANSACTION_LABEL_MAP } from 'constants/mappings';
import TransactionIcon from 'components/module/TransactionIcon';

const TransactionsView = (props: TransactionsProps) => {
  const { navigation, wallets, language } = props;
  const { styles, theme, colors } = useStyles();
  const entities = useSelector((state: RootState) => state.entities);

  const { filteredTransactions, dailyFilteredTransactions } =
    useFilteredTransactions();

  const [exportStatus, setExportStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'>('IDLE');

  useEffect(() => {
    if (exportStatus === 'SUCCESS' || exportStatus === 'FAILED') {
      setTimeout(() => {
        setExportStatus('IDLE');
      }, 3000);
    }
  }, [exportStatus]);

  const renderTransaction = ({ item: transaction }: { item: Transaction }) => {
    const sourceWallet = wallets[transaction.sourceWalletId];
    const destinationWallet = transaction.destinationWalletId ? wallets[transaction.destinationWalletId] : null;
    
    const kind = transaction.kind || TransactionKind.PAYMENT;
    const typeLabel = TRANSACTION_LABEL_MAP[kind] || "Transaction";
    const entity = transaction.entityId ? entities[transaction.entityId] : null;
    
    let displayName = transaction.payee || "Unknown";
    if (transaction.isTransfer && destinationWallet) {
        displayName = `Transfer to ${destinationWallet.label}`;
    }

    const getAmountLabel = () => {
        switch (kind) {
            case TransactionKind.INCOME: return "Received";
            case TransactionKind.BILL_PAYMENT: return "Paid";
            case TransactionKind.BUY: return "Invested";
            case TransactionKind.WITHDRAWAL: return "Withdrawn";
            case TransactionKind.REFUND: return "Refunded";
            default: return "Amount";
        }
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TRANSACTION_DETAILS', {
            transactionId: transaction.id,
          })
        }
        style={localStyles.transactionRow}
        activeOpacity={0.6}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
          <TransactionIcon 
            entityLogo={entity?.logo} 
            entityName={displayName} 
            kind={kind} 
            isTransfer={transaction.isTransfer} 
          />

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <TextView variant="body" style={{ fontWeight: '600', color: colors.PRIMARY_TEXT }} numberOfLines={1} theme={theme}>
                {displayName}
              </TextView>
              <View style={{ paddingHorizontal: 6, paddingVertical: 1, backgroundColor: colors.BORDER + '60', borderRadius: 10 }}>
                <TextView variant="label" style={{ fontSize: 8, color: colors.SECONDARY_TEXT }} theme={theme}>
                    {typeLabel.toUpperCase()}
                </TextView>
              </View>
            </View>
            
            <TextView variant="label" style={{ color: colors.PLACE_HOLDER, textTransform: 'none' }} theme={theme}>
              {`${transaction.category} • ${sourceWallet?.label || ''}`}
            </TextView>
            
            {!!transaction.description && transaction.description !== transaction.payee && (
                <TextView variant="label" style={{ color: colors.PLACE_HOLDER, fontStyle: 'italic', marginTop: 4, textTransform: 'none', fontSize: 10 }} theme={theme}>
                    {transaction.description}
                </TextView>
            )}
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <TextView 
                variant="money"
                style={{ color: transaction.amount < 0 ? colors.NEGATIVE : colors.POSITIVE }} 
                theme={theme}
            >
              {`${transaction.amount < 0 ? '−' : '+'}${formatCurrency(Math.abs(transaction.amount), { language })}`}
            </TextView>
            <TextView variant="label" style={{ fontSize: 9, color: colors.PLACE_HOLDER, marginTop: 2 }} theme={theme}>
                {getAmountLabel().toUpperCase()}
            </TextView>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      
      <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: colors.BORDER, paddingHorizontal: 24, paddingVertical: 24, height: 'auto', alignItems: 'flex-start' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                style={{ marginRight: 16 }}
                onPress={() => navigation.goBack()}
            >
                <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
            </TouchableOpacity>
            <View>
                <TextView variant="label" theme={theme} translationKey="ALL" />
                <TextView variant="title" translationKey="TRANSACTIONS" theme={theme} />
            </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <FilterButton
                onPress={() => navigation.navigate('FILTERS')}
            />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, paddingTop: 32 }}
          sections={dailyFilteredTransactions}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { day } }) => {
            const d = formatDate(day, 'd');
            const m = formatDate(day, 'MMM');
            return (
              <View style={localStyles.dateHeader}>
                <View style={localStyles.dateMarker}>
                  <TextView variant="title" style={{ color: colors.PRIMARY_TEXT }} theme={theme}>{`${d}`}</TextView>
                  <TextView variant="label" style={{ color: colors.PLACE_HOLDER, marginTop: 4 }} theme={theme}>
                    {m}
                  </TextView>
                </View>
                <View style={[localStyles.dateLine, { backgroundColor: colors.BORDER }]} />
              </View>
            );
          }}
          renderItem={({ item }) => renderTransaction({ item: item })}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('CREATE_TRANSACTION')}
        style={[localStyles.fab, { backgroundColor: colors.PRIMARY }]}
      >
        <Plus size={24} color={colors.BACKGROUND} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 32,
    marginTop: 24,
  },
  dateMarker: {
    alignItems: 'flex-start',
    width: 40,
  },
  dateLine: {
    flex: 1,
    height: 1,
    marginTop: 12,
  },
  transactionRow: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});

export default TransactionsView;
