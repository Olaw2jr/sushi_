import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Plus, ChevronRight, AlertCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from 'store';
import { COLORS } from 'theme';
import TextView from 'components/base/Text/view';
import { formatCurrency } from 'utils/formatCurrency';
import { useNavigation } from '@react-navigation/native';
import { Wallet } from 'store/wallets';
import Card from 'components/base/Card';
import { Wallet as WalletIcon, Landmark, Smartphone, CreditCard, PieChart, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react-native';

const maskSensitiveData = (value: string | null | undefined) => {
  if (!value) return "N/A";
  const cleanValue = value.replace(/\s/g, "");
  if (cleanValue.length <= 4) return value;
  return `****${cleanValue.slice(-4)}`;
};

const AccountsScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useSelector((state: RootState) => state.theme);
  const language = useSelector((state: RootState) => state.currency.language);
  const colors = COLORS[theme.base];
  
  const wallets = useSelector((state: RootState) => state.wallets);
  const transactions = useSelector((state: RootState) => state.transactions);
  
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const walletsArray = Object.values(wallets);
  const transactionsArray = Object.values(transactions);

  const budgetAccounts = walletsArray.filter(w => w.onBudget && !w.closed);
  const trackingAccounts = walletsArray.filter(w => !w.onBudget && !w.closed);

  const getWalletBalance = (walletId: string) => {
    const wallet = wallets[walletId];
    if (!wallet) return 0;
    
    const walletTransactions = transactionsArray.filter(
      (t) => t.sourceWalletId === walletId || t.destinationWalletId === walletId
    );
    
    const totalChange = walletTransactions.reduce((acc, t) => {
      if (t.destinationWalletId === walletId) {
        return acc + Math.abs(t.amount || 0);
      }
      return acc + (t.amount || 0);
    }, 0);

    return (wallet.initialAmount || 0) + totalChange;
  };

  const totalAssets = walletsArray
    .filter(w => !w.closed)
    .reduce((sum, w) => {
        const bal = getWalletBalance(w.id);
        return sum + (bal > 0 ? bal : 0);
    }, 0);

  const totalLiabilities = walletsArray
    .filter(w => !w.closed)
    .reduce((sum, w) => {
        const bal = getWalletBalance(w.id);
        return sum + (bal < 0 ? Math.abs(bal) : 0);
    }, 0);

  const selectedWallet = selectedWalletId ? wallets[selectedWalletId] : null;
  const selectedBalance = selectedWalletId ? getWalletBalance(selectedWalletId) : 0;

  const getAccountIcon = (label: string, size = 20) => {
    const l = label.toLowerCase();
    if (l.includes('bank') || l.includes('account')) return <Landmark size={size} color={colors.PRIMARY} />;
    if (l.includes('savings')) return <PieChart size={size} color={colors.PRIMARY} />;
    if (l.includes('mpesa') || l.includes('mobile') || l.includes('wallet')) return <Smartphone size={size} color={colors.PRIMARY} />;
    if (l.includes('loan') || l.includes('debt') || l.includes('credit')) return <CreditCard size={size} color={colors.PRIMARY} />;
    return <WalletIcon size={size} color={colors.PRIMARY} />;
  };

  const renderAccountCard = (wallet: Wallet) => {
    const balance = getWalletBalance(wallet.id);
    const isDebt = wallet.type === AccountType.LOAN || wallet.type === AccountType.CREDIT_CARD;
    
    // Type-specific secondary info mirroring web columns
    const renderSecondaryInfo = () => {
        switch (wallet.type) {
            case AccountType.LOAN: {
                const progress = wallet.initialAmount !== 0 ? ((Math.abs(wallet.initialAmount) - Math.abs(balance)) / Math.abs(wallet.initialAmount)) * 100 : 0;
                return (
                    <TextView variant="label" style={{ color: colors.POSITIVE, fontSize: 10, textTransform: 'none' }} theme={theme}>
                        {Math.max(0, progress).toFixed(0)}% paid off
                    </TextView>
                );
            }
            case AccountType.CREDIT_CARD: {
                const utilization = wallet.creditLimit > 0 ? (Math.abs(balance) / wallet.creditLimit) * 100 : 0;
                return (
                    <TextView variant="label" style={{ color: utilization > 70 ? colors.NEGATIVE : colors.SECONDARY_TEXT, fontSize: 10, textTransform: 'none' }} theme={theme}>
                        {utilization.toFixed(0)}% utilization
                    </TextView>
                );
            }
            case AccountType.INVESTMENT:
            case AccountType.BROKERAGE: {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <ArrowUp size={10} color={colors.POSITIVE} />
                        <TextView variant="label" style={{ color: colors.POSITIVE, fontSize: 10 }} theme={theme}>8.5%</TextView>
                    </View>
                );
            }
            default:
                return wallet.accountNumber ? (
                    <TextView variant="label" style={{ color: colors.PLACE_HOLDER, fontSize: 10 }} theme={theme}>
                        {maskSensitiveData(wallet.accountNumber)}
                    </TextView>
                ) : null;
        }
    };

    return (
        <TouchableOpacity
            key={wallet.id}
            onPress={() => {
                setSelectedWalletId(wallet.id);
                setView('detail');
            }}
            activeOpacity={0.7}
        >
            <Card style={{ backgroundColor: colors.AREA_HIGHLIGHT, padding: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={[localStyles.iconContainer, { backgroundColor: colors.BORDER + '40' }]}>
                        {getAccountIcon(wallet.label)}
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextView variant="body" style={{ fontWeight: '600' }} theme={theme}>{wallet.label}</TextView>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                            <TextView variant="label" style={{ color: colors.PLACE_HOLDER, textTransform: 'none', fontSize: 10 }} theme={theme}>
                                {wallet.type}
                            </TextView>
                            {renderSecondaryInfo()}
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TextView variant="money" style={{ color: balance < 0 ? colors.NEGATIVE : colors.PRIMARY_TEXT }} theme={theme}>
                            {formatCurrency(balance, { language })}
                        </TextView>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[localStyles.container, { backgroundColor: colors.BACKGROUND }]} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={colors.BACKGROUND} barStyle={colors.STATUS_BAR} />
      
      {/* Header */}
      <View style={[localStyles.header, { borderBottomColor: colors.BORDER, backgroundColor: colors.BACKGROUND }]}>
        <View style={{ flex: 1 }}>
          <TextView variant="label" style={localStyles.headerSubtitle} theme={theme}>
            {view === 'list' ? 'ALL ACCOUNTS' : 'ACCOUNT DETAILS'}
          </TextView>
          <TextView variant="title" theme={theme}>
            {view === 'list' ? 'Accounts' : selectedWallet?.label}
          </TextView>
        </View>

        {view === 'list' ? (
          <TouchableOpacity 
            style={localStyles.headerAction} 
            onPress={() => navigation.navigate('CREATE_WALLET')}
          >
            <Plus size={24} color={colors.PRIMARY_TEXT} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={localStyles.headerAction} 
            onPress={() => {
                setView('list');
                setSelectedWalletId(null);
            }}
          >
            <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>Close</TextView>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, paddingTop: 32 }}>
        
        {view === 'list' && (
          <View style={{ gap: 48 }}>
            {/* Global Summary */}
            <View style={{ flexDirection: 'row', gap: 16 }}>
                <Card style={{ flex: 1, backgroundColor: colors.AREA_HIGHLIGHT, padding: 16 }}>
                    <TextView variant="label" style={{ fontSize: 9, color: colors.PLACE_HOLDER }} theme={theme}>TOTAL ASSETS</TextView>
                    <TextView variant="money" style={{ color: colors.POSITIVE, marginTop: 4 }} theme={theme}>
                        {formatCurrency(totalAssets, { language })}
                    </TextView>
                </Card>
                <Card style={{ flex: 1, backgroundColor: colors.AREA_HIGHLIGHT, padding: 16 }}>
                    <TextView variant="label" style={{ fontSize: 9, color: colors.PLACE_HOLDER }} theme={theme}>LIABILITIES</TextView>
                    <TextView variant="money" style={{ color: colors.NEGATIVE, marginTop: 4 }} theme={theme}>
                        {formatCurrency(totalLiabilities, { language })}
                    </TextView>
                </Card>
            </View>

            {/* Budget Accounts */}
            <View style={{ gap: 16 }}>
              <TextView variant="sectionTitle" theme={theme}>BUDGET ACCOUNTS</TextView>
              <View style={{ gap: 12 }}>
                {budgetAccounts.map(renderAccountCard)}
              </View>
            </View>

            {/* Tracking Accounts */}
            {trackingAccounts.length > 0 && (
                <View style={{ gap: 16 }}>
                    <TextView variant="sectionTitle" theme={theme}>TRACKING ACCOUNTS</TextView>
                    <View style={{ gap: 12 }}>
                        {trackingAccounts.map(renderAccountCard)}
                    </View>
                </View>
            )}
          </View>
        )}

        {view === 'detail' && selectedWallet && (
          <View style={{ gap: 48, alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 16 }}>
              <View style={[localStyles.bigIconContainer, { backgroundColor: colors.BORDER + '40' }]}>
                {getAccountIcon(selectedWallet.label, 48)}
              </View>
              <View style={{ alignItems: 'center' }}>
                <TextView variant="title" style={{ textAlign: 'center' }} theme={theme}>
                  {selectedWallet.label}
                </TextView>
                <TextView variant="label" style={{ color: colors.PLACE_HOLDER }} theme={theme}>
                  {selectedWallet.type}
                </TextView>
              </View>
            </View>

            <View style={{ alignItems: 'center' }}>
              <TextView variant="sectionTitle" theme={theme}>CURRENT BALANCE</TextView>
              <TextView variant="moneyLg" style={{ fontSize: 48 }} theme={theme}>
                {formatCurrency(selectedBalance, { language })}
              </TextView>
            </View>

            <View style={{ gap: 16, width: '100%' }}>
                <TouchableOpacity 
                    style={[localStyles.detailButton, { borderBottomColor: colors.BORDER }]}
                    onPress={() => navigation.navigate('WALLET_DETAILS', { walletId: selectedWallet.id })}
                >
                    <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>View Transactions</TextView>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[localStyles.detailButton, { borderBottomColor: colors.BORDER }]}
                    onPress={() => navigation.navigate('EDIT_WALLET', { walletId: selectedWallet.id })}
                >
                    <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>Edit Account</TextView>
                </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
  },
  headerSubtitle: {
    marginBottom: 4,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButton: {
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  }
});

export default AccountsScreen;