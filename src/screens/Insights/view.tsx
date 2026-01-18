import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { InsightsProps } from './props';
import WalletCard from 'components/module/WalletCard';
import { Settings, TrendingUp, TrendingDown, Calendar, Flame, Wallet as WalletIcon, ArrowUpRight } from 'lucide-react-native';
import { formatCurrency } from 'utils/formatCurrency';
import TextView from 'components/base/Text/view';
import { Translation } from 'types/Translation';
import useFilteredTransactions from 'utils/hooks/useFilteredTransactions';
import FilterButton from 'components/module/FilterButton';
import MetricsCards from 'components/module/MetricsCards';
import useFinancialOverview from 'utils/hooks/useFinancialOverview';
import Card from 'components/base/Card';
import { groupBy } from 'ramda';
import DebtTracker from 'components/module/DebtTracker';
import { AccountType } from 'constants/enums';

const SubHeader = (props: {
  label: keyof Translation;
  action?: () => void;
  actionText?: keyof Translation;
}) => {
  const { styles, theme } = useStyles();
  return (
    <View style={styles.contentHeader}>
      <TextView variant="sectionTitle" theme={theme} translationKey={props.label} />

      {!!props.actionText && (
        <TouchableOpacity onPress={props.action}>
          <TextView
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

const InsightsView = (props: InsightsProps) => {
  const { navigation, wallets, language } = props;
  const { styles, theme, colors } = useStyles();
  const [activeTab, setActiveTab] = useState<'cash-flow' | 'portfolio' | 'liabilities'>('cash-flow');
  const [timeframe, setTimeframe] = useState('month');

  const { filteredTransactions } = useFilteredTransactions();
  const overview = useFinancialOverview();
  const walletsArray = Object.keys(wallets).map((key) => wallets[key]);

  // Insights Data Calculation
  const income = filteredTransactions
    .filter(t => t.amount > 0 && !t.destinationWalletId)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const expenses = filteredTransactions
    .filter(t => t.amount < 0 && !t.destinationWalletId)
    .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  // Categories Breakdown
  const byCategory = groupBy((t: any) => t.category, filteredTransactions);
  const topCategories = Object.entries(byCategory).map(([cat, txns]) => {
    // @ts-ignore
    const spent = txns.reduce((sum, t) => t.amount < 0 ? sum + Math.abs(t.amount) : sum, 0);
    return { name: cat, spent, percentage: expenses > 0 ? (spent / expenses) * 100 : 0 };
  }).filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent).slice(0, 5);

  const debts = walletsArray
    .filter(w => w.type === AccountType.LOAN || w.type === AccountType.CREDIT_CARD)
    .map(w => ({
      name: w.label,
      principal: Math.abs(w.initialAmount) * 1.2, // Mocked principal
      currentBalance: Math.abs(w.balance || w.initialAmount),
      paidAmount: Math.abs(w.initialAmount) * 0.2, // Mocked paid
      interestRate: w.interestRate || 15,
      monthlyPayment: w.nextPaymentAmount || 0,
    }));

  const CashFlowContent = () => (
    <>
      {/* Timeframe Toggles */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32, gap: 12 }}>
          {['month', 'quarter', 'year'].map(t => (
              <TouchableOpacity 
                  key={t} 
                  onPress={() => setTimeframe(t)}
                  style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderBottomWidth: 2,
                      borderColor: timeframe === t ? colors.PRIMARY : 'transparent'
                  }}>
                  <TextView 
                      theme={theme} 
                      variant="label"
                      style={{ 
                          color: timeframe === t ? colors.PRIMARY_TEXT : colors.PLACE_HOLDER,
                          letterSpacing: 2,
                      }}>
                      {t}
                  </TextView>
              </TouchableOpacity>
          ))}
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
        <MetricsCards {...overview} />
      </View>

      {/* Hero Tier Content (Monthly Cash Flow Card) */}
      <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <Card style={{ backgroundColor: colors.AREA_HIGHLIGHT }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <TextView variant="label" theme={theme}>MONTHLY CASH FLOW</TextView>
                  <WalletIcon size={16} color={colors.SECONDARY_TEXT} />
              </View>
              <TextView variant="moneyLg" theme={theme}>
                  {formatCurrency(overview.monthlyCashFlow, { language })}
              </TextView>
              <View style={{ marginTop: 20, height: 8, width: '100%', backgroundColor: colors.BORDER, borderRadius: 4, overflow: 'hidden' }}>
                  <View 
                    style={{ 
                        height: '100%', 
                        width: `${Math.max(0, Math.min(savingsRate, 100))}%`, 
                        backgroundColor: colors.PRIMARY 
                    }} 
                  />
              </View>
              <TextView variant="label" theme={theme} style={{ marginTop: 12, color: colors.SECONDARY_TEXT, textTransform: 'none' }}>
                  {savingsRate.toFixed(1)}% savings rate
              </TextView>
          </Card>
      </View>

      <View style={{ marginTop: 32 }}>
        <SubHeader label="MY_ACCOUNTS" />
        <View style={[styles.walletsScrollContainer, { marginTop: 8 }]}>
          <ScrollView
            contentContainerStyle={[styles.contentScroll, { paddingHorizontal: 24 }]}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {walletsArray.map((wallet) => {
              const walletTransactions = filteredTransactions.filter(
                (transaction) =>
                  transaction.sourceWalletId === wallet.id ||
                  transaction.destinationWalletId === wallet.id,
              );
              const totalTransactionAmount = walletTransactions.reduce(
                (currentTotal: number, transaction) => {
                  if (transaction.destinationWalletId === wallet.id) {
                    return currentTotal + -transaction.amount;
                  }
                  return currentTotal + transaction.amount;
                },
                0,
              );

              const currentWalletBalance =
                (wallet.initialAmount || 0) + totalTransactionAmount;
              return (
                <WalletCard
                  containerStyle={[styles.walletCard, { marginRight: 16 }]}
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

      {/* Where Money Flows */}
      <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <TextView variant="sectionTitle" theme={theme} style={{ marginBottom: 20 }}>WHERE MONEY FLOWS</TextView>
          <View style={{ gap: 16 }}>
              {topCategories.map((cat) => (
                  <Card key={cat.name} style={{ backgroundColor: colors.AREA_HIGHLIGHT }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                          <TextView variant="body" style={{ fontWeight: '500' }} theme={theme}>{cat.name}</TextView>
                          <TextView variant="money" theme={theme}>{formatCurrency(cat.spent, { language })}</TextView>
                      </View>
                      <View style={{ height: 2, backgroundColor: colors.BORDER, width: '100%' }}>
                          <View style={{ height: 2, backgroundColor: colors.PRIMARY, width: `${Math.min(cat.percentage, 100)}%` }} />
                      </View>
                  </Card>
              ))}
          </View>
      </View>

      {/* Observations */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 32, marginTop: 32, borderTopWidth: 1, borderTopColor: colors.DIVIDER }}>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Calendar size={20} color={colors.SECONDARY_TEXT} />
              <TextView variant="body" theme={theme} style={{ fontSize: 14, color: colors.SECONDARY_TEXT, lineHeight: 20 }}>
                  {expenses > income ? 'Spending exceeds income. Review discretionary categories.' : 'Spending is within income limits.'}
              </TextView>
          </View>
      </View>
    </>
  );

  const PortfolioContent = () => {
    // Ideal allocation for a balanced portfolio (mirrored from web)
    const idealAllocation = [
        { type: AccountType.CHECKING, min: 5, max: 10 },
        { type: AccountType.SAVINGS, min: 20, max: 30 },
        { type: AccountType.INVESTMENT, min: 40, max: 60 },
    ];

    const assetsByType = groupBy(w => w.type, walletsArray);
    const totalAssetValue = walletsArray.reduce((sum, w) => sum + Math.max(0, w.balance || w.initialAmount), 0);

    return (
        <View style={{ padding: 24, gap: 32 }}>
            <View>
                <TextView variant="subtitle" theme={theme}>Asset Diversification</TextView>
                <TextView variant="label" style={{ color: colors.PLACE_HOLDER, textTransform: 'none', marginTop: 6 }} theme={theme}>
                    Current Portfolio Allocation
                </TextView>
            </View>
            
            <View style={{ gap: 16 }}>
                {Object.entries(assetsByType).map(([type, items]) => {
                    const total = items.reduce((sum, w) => sum + (w.balance || w.initialAmount), 0);
                    if (total <= 0) return null;

                    const percentage = totalAssetValue > 0 ? (total / totalAssetValue) * 100 : 0;
                    const ideal = idealAllocation.find((i) => i.type === type);
                    
                    const status = ideal
                        ? percentage < ideal.min
                            ? "underweight"
                            : percentage > ideal.max
                                ? "overweight"
                                : "balanced"
                        : "balanced";

                    return (
                        <Card key={type} style={{ backgroundColor: colors.AREA_HIGHLIGHT }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <View style={{ flex: 1 }}>
                                    <TextView variant="body" theme={theme} style={{ fontWeight: '600' }}>{type.replace(/_/g, ' ')}</TextView>
                                    <TextView variant="money" theme={theme} style={{ marginTop: 2 }}>{formatCurrency(total, { language })}</TextView>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextView variant="body" theme={theme}>{percentage.toFixed(1)}%</TextView>
                                    <View style={{ 
                                        paddingHorizontal: 8, 
                                        paddingVertical: 2, 
                                        borderRadius: 4, 
                                        marginTop: 4,
                                        backgroundColor: status === 'balanced' ? colors.POSITIVE + '20' : colors.NEGATIVE + '20' 
                                    }}>
                                        <TextView variant="label" style={{ 
                                            fontSize: 10, 
                                            color: status === 'balanced' ? colors.POSITIVE : colors.NEGATIVE 
                                        }} theme={theme}>
                                            {status.toUpperCase()}
                                        </TextView>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: 4, backgroundColor: colors.BORDER, borderRadius: 2, overflow: 'hidden' }}>
                                <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: colors.PRIMARY }} />
                            </View>
                        </Card>
                    );
                })}
            </View>

            <Card style={{ backgroundColor: colors.DIVIDER, padding: 24 }}>
                <TextView variant="label" theme={theme} style={{ marginBottom: 12 }}>PROJECTION</TextView>
                <TextView variant="body" style={{ color: colors.SECONDARY_TEXT, lineHeight: 20 }} theme={theme}>
                    Net Worth Projections and future wealth predictability charts will be available in the next sync.
                </TextView>
            </Card>
        </View>
    );
  };

  const LiabilitiesContent = () => (
    <View style={{ padding: 24, gap: 32 }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
            <Card style={{ flex: 1, backgroundColor: colors.AREA_HIGHLIGHT }}>
                <TextView variant="label" theme={theme} style={{ marginBottom: 12 }}>DEBT-TO-INCOME</TextView>
                <TextView variant="moneyLg" theme={theme}>
                    {overview.dti.toFixed(1)}%
                </TextView>
                <TextView variant="label" theme={theme} style={{ marginTop: 12, color: colors.SECONDARY_TEXT, textTransform: 'none' }}>
                    Monthly debt payments vs Income
                </TextView>
            </Card>
        </View>

        {debts.length > 0 ? (
            <DebtTracker debts={debts} />
        ) : (
            <View style={{ alignItems: 'center', marginVertical: 48 }}>
                <TextView variant="body" style={{ color: colors.PLACE_HOLDER }} theme={theme}>No active debts found.</TextView>
            </View>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('DEBT_ANALYSIS')}>
            <Card style={{ backgroundColor: colors.PRIMARY + '10', borderColor: colors.PRIMARY + '30', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <Flame size={24} color={colors.PRIMARY} />
                <View style={{ flex: 1 }}>
                    <TextView variant="subtitle" theme={theme} style={{ fontSize: 16, color: colors.PRIMARY }}>Debt Strategy</TextView>
                    <TextView variant="body" theme={theme} style={{ fontSize: 13, color: colors.PRIMARY, marginTop: 4 }}>
                        Analyze your payoff efficiency.
                    </TextView>
                </View>
            </Card>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      
      {/* Header Tier */}
      <View style={styles.header}>
        <View style={styles.headerActionContainer} />
        <View style={styles.balanceContainer}>
          <TextView variant="sectionTitle" theme={theme} style={{ marginBottom: 4 }}>
            NET WORTH
          </TextView>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <TextView variant="moneyLg" theme={theme}>
                {formatCurrency(overview.netWorth, { language })}
              </TextView>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ArrowUpRight size={14} color={colors.POSITIVE} />
                  <TextView variant="label" style={{ color: colors.POSITIVE, fontSize: 10 }} theme={theme}>+0.0%</TextView>
              </View>
          </View>
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

      {/* Tabs Control */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, marginTop: 8, backgroundColor: colors.BACKGROUND }}>
          {[
              { id: 'cash-flow', label: 'Cash Flow' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'liabilities', label: 'Liabilities' }
          ].map(tab => (
              <TouchableOpacity 
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as any)}
                  style={{ 
                      flex: 1, 
                      paddingVertical: 16, 
                      alignItems: 'center',
                      borderBottomWidth: 2,
                      borderColor: activeTab === tab.id ? colors.PRIMARY : 'transparent'
                  }}>
                  <TextView 
                    variant="label" 
                    theme={theme} 
                    style={{ 
                        color: activeTab === tab.id ? colors.PRIMARY_TEXT : colors.PLACE_HOLDER,
                        fontSize: 11
                    }}>
                      {tab.label}
                  </TextView>
              </TouchableOpacity>
          ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'cash-flow' && <CashFlowContent />}
        {activeTab === 'portfolio' && <PortfolioContent />}
        {activeTab === 'liabilities' && <LiabilitiesContent />}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsightsView;