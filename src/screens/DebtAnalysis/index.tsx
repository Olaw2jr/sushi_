import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Flame, Calculator, TrendingDown } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import Text from 'components/base/Text';
import TextView from 'components/base/Text/view';
import Card from 'components/base/Card';
import { formatCurrency } from 'utils/formatCurrency';
import { AccountType } from 'constants/enums';

const calculateTotalInterest = (balance: number, annualRate: number, monthlyPayment: number): number => {
  let remaining = balance;
  let totalInterest = 0;
  const monthlyRate = annualRate / 100 / 12;

  // Safety break to avoid infinite loops if payment is less than interest
  let iterations = 0;
  while (remaining > 0 && iterations < 1200) {
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    remaining = remaining + interest - monthlyPayment;
    if (remaining < 0) remaining = 0;
    iterations++;
  }

  return totalInterest;
};

const DebtAnalysisScreen = ({ navigation }: any) => {
  const theme = useSelector((state: RootState) => state.theme);
  const language = useSelector((state: RootState) => state.currency.language);
  const colors = COLORS[theme.base];
  const wallets = useSelector((state: RootState) => state.wallets);

  const debts = Object.values(wallets)
    .filter(w => w.type === AccountType.LOAN || w.type === AccountType.CREDIT_CARD)
    .map(w => ({
      name: w.label,
      currentBalance: Math.abs(w.initialAmount), // For now using initialAmount as balance
      interestRate: w.interestRate || 15,
      monthlyPayment: w.nextPaymentAmount || Math.abs(w.initialAmount) / 24,
    }));

  const analyzedDebts = debts.map(debt => {
    const monthlyInterest = (debt.currentBalance * (debt.interestRate / 100)) / 12;
    const totalInterestIfPaidMinimum = calculateTotalInterest(
      debt.currentBalance,
      debt.interestRate,
      debt.monthlyPayment
    );
    const monthsToPayoff = Math.ceil(debt.currentBalance / debt.monthlyPayment);

    return {
      ...debt,
      monthlyInterest,
      totalInterestIfPaidMinimum,
      monthsToPayoff,
    };
  }).sort((a, b) => b.interestRate - a.interestRate);

  const bestToPayFirst = analyzedDebts[0];
  const extraPayment = 100000; // Extra 100k

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar backgroundColor={colors.BACKGROUND} barStyle={colors.STATUS_BAR} />
      <View style={[styles.header, { borderBottomColor: colors.BORDER }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <TextView variant="title" theme={theme}>Debt Strategy</TextView>
          <TextView variant="label" theme={theme}>AVALANCHE METHOD</TextView>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {analyzedDebts.length > 0 ? (
          <>
            <Card style={{ backgroundColor: colors.PRIMARY + '10', borderColor: colors.PRIMARY + '30', marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <TrendingDown size={18} color={colors.PRIMARY} />
                <TextView variant="body" style={{ fontWeight: '600', color: colors.PRIMARY }} theme={theme}>
                  Recommended: Pay {bestToPayFirst.name} first
                </TextView>
              </View>
              <TextView variant="body" style={{ fontSize: 13, color: colors.SECONDARY_TEXT }} theme={theme}>
                At {bestToPayFirst.interestRate}% interest, this loan costs you {formatCurrency(bestToPayFirst.monthlyInterest, { language })}/month in interest alone.
              </TextView>
            </Card>

            <TextView variant="sectionTitle" theme={theme} style={{ marginBottom: 16 }}>PRIORITY LIST</TextView>
            
            <View style={{ gap: 16, marginBottom: 32 }}>
              {analyzedDebts.map((debt, index) => (
                <Card key={debt.name} style={{ backgroundColor: colors.AREA_HIGHLIGHT }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.DIVIDER, alignItems: 'center', justifyContent: 'center' }}>
                        <TextView variant="label" theme={theme} style={{ fontSize: 10 }}>{index + 1}</TextView>
                      </View>
                      <TextView variant="subtitle" theme={theme} style={{ fontSize: 16 }}>{debt.name}</TextView>
                    </View>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.BORDER }}>
                      <TextView variant="label" theme={theme} style={{ fontSize: 10 }}>{debt.interestRate}% APR</TextView>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                    <View style={{ width: '45%' }}>
                      <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER }}>BALANCE</TextView>
                      <TextView variant="money" theme={theme}>{formatCurrency(debt.currentBalance, { language })}</TextView>
                    </View>
                    <View style={{ width: '45%' }}>
                      <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER }}>MO. INTEREST</TextView>
                      <TextView variant="money" theme={theme} style={{ color: colors.NEGATIVE }}>{formatCurrency(debt.monthlyInterest, { language })}</TextView>
                    </View>
                    <View style={{ width: '45%' }}>
                      <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER }}>PAYOFF TIME</TextView>
                      <TextView variant="body" theme={theme} style={{ fontWeight: '500' }}>{debt.monthsToPayoff} months</TextView>
                    </View>
                    <View style={{ width: '45%' }}>
                      <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER }}>TOTAL INTEREST</TextView>
                      <TextView variant="money" theme={theme}>{formatCurrency(debt.totalInterestIfPaidMinimum, { language })}</TextView>
                    </View>
                  </View>
                </Card>
              ))}
            </View>

            <Card style={{ backgroundColor: colors.DIVIDER, padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Calculator size={18} color={colors.SECONDARY_TEXT} />
                <TextView variant="subtitle" theme={theme} style={{ fontSize: 16 }}>Extra {formatCurrency(extraPayment, { language })} Impact</TextView>
              </View>
              <TextView variant="body" theme={theme} style={{ fontSize: 14, color: colors.SECONDARY_TEXT }}>
                Applying an extra {formatCurrency(extraPayment, { language })} per month to your highest interest debt could save you thousands in interest and months of payments.
              </TextView>
            </Card>
          </>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
            <Flame size={48} color={colors.BORDER} />
            <TextView variant="subtitle" theme={theme} style={{ marginTop: 16, color: colors.PLACE_HOLDER }}>No active debts found</TextView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
});

export default DebtAnalysisScreen;
