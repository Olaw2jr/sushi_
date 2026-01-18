import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import Card from 'components/base/Card';
import TextView from 'components/base/Text/view';
import { formatCurrency } from 'utils/formatCurrency';

interface Debt {
  name: string;
  principal: number;
  currentBalance: number;
  paidAmount: number;
  interestRate: number;
  monthlyPayment: number;
}

interface DebtTrackerProps {
  debts: Debt[];
}

const DebtTracker = ({ debts }: DebtTrackerProps) => {
  const theme = useSelector((state: RootState) => state.theme);
  const language = useSelector((state: RootState) => state.currency.language);
  const colors = COLORS[theme.base];

  return (
    <Card style={styles.container}>
      <TextView variant="subtitle" theme={theme} style={styles.title}>Debt Payoff Progress</TextView>
      <TextView variant="label" theme={theme} style={styles.subtitle}>Track your loan repayments</TextView>
      
      <View style={styles.content}>
        {debts.map((debt) => {
          const progress = debt.principal > 0 ? (debt.paidAmount / debt.principal) : 0;
          return (
            <View key={debt.name} style={styles.debtItem}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <TextView variant="body" style={{ fontWeight: '600' }} theme={theme}>{debt.name}</TextView>
                  <TextView variant="label" style={{ color: colors.PLACE_HOLDER, textTransform: 'none' }} theme={theme}>
                    {debt.interestRate}% interest • {formatCurrency(debt.monthlyPayment, { language })}/mo
                  </TextView>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <TextView variant="label" theme={theme} style={{ color: colors.SECONDARY_TEXT }}>
                    Rem: {formatCurrency(debt.currentBalance, { language })}
                  </TextView>
                  <TextView variant="label" theme={theme} style={{ color: colors.POSITIVE, textTransform: 'none' }}>
                    Paid: {formatCurrency(debt.paidAmount, { language })}
                  </TextView>
                </View>
              </View>
              
              <View style={[styles.progressBarBg, { backgroundColor: colors.BORDER }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${Math.min(progress * 100, 100)}%`,
                      backgroundColor: colors.PRIMARY 
                    }
                  ]} 
                />
              </View>
              
              <View style={styles.footerRow}>
                <TextView variant="label" style={styles.footerText} theme={theme}>0%</TextView>
                <TextView variant="label" style={styles.footerText} theme={theme}>{(progress * 100).toFixed(1)}% paid</TextView>
                <TextView variant="label" style={styles.footerText} theme={theme}>100%</TextView>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#a8a29e',
    marginBottom: 24,
    textTransform: 'none',
  },
  content: {
    gap: 24,
  },
  debtItem: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 10,
    color: '#a8a29e',
  }
});

export default DebtTracker;
