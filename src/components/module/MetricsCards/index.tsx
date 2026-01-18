import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import Card from 'components/base/Card';
import Text from 'components/base/Text/view';
import { Wallet, Clock, ArrowUpDown, CreditCard, PieChart, Percent, TrendingUp, TrendingDown } from 'lucide-react-native';
import { formatCurrency } from 'utils/formatCurrency';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}

interface MetricsCardsProps {
  netWorth: number;
  ageOfMoney: number;
  monthlyCashFlow: number;
  totalDebt: number;
  portfolioPerformance: number;
  savingsRate: number;
}

const MetricsCards = ({
  netWorth,
  ageOfMoney,
  monthlyCashFlow,
  totalDebt,
  portfolioPerformance,
  savingsRate,
}: MetricsCardsProps) => {
  const { width } = useWindowDimensions();
  const theme = useSelector((state: RootState) => state.theme);
  const language = useSelector((state: RootState) => state.language.selected);
  const colors = COLORS[theme.base];

  const isTablet = width > 768;
  const cardWidth = isTablet ? '31%' : '48%';

  const metrics: Metric[] = [
    {
      label: 'Total Net Worth',
      value: formatCurrency(netWorth, { language }),
      change: '+12.5%',
      trend: 'up',
      icon: Wallet,
    },
    {
      label: 'Age of Money',
      value: `${ageOfMoney} Days`,
      change: ageOfMoney >= 30 ? 'Healthy' : 'Keep Earning',
      trend: ageOfMoney >= 30 ? 'up' : 'down',
      icon: Clock,
    },
    {
      label: 'Monthly Cash Flow',
      value: formatCurrency(monthlyCashFlow, { language }),
      change: monthlyCashFlow > 0 ? '+Positive' : '-Negative',
      trend: monthlyCashFlow > 0 ? 'up' : 'down',
      icon: ArrowUpDown,
    },
    {
      label: 'Total Debt Load',
      value: formatCurrency(totalDebt, { language }),
      change: '-8.2%',
      trend: 'down',
      icon: CreditCard,
    },
    {
      label: 'Portfolio Perf.',
      value: `${portfolioPerformance.toFixed(1)}%`,
      change: portfolioPerformance > 0 ? 'Gain' : 'Loss',
      trend: portfolioPerformance > 0 ? 'up' : 'down',
      icon: PieChart,
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: savingsRate >= 20 ? 'Healthy' : 'Low',
      trend: savingsRate >= 20 ? 'up' : 'down',
      icon: Percent,
    },
  ];

  return (
    <View style={styles.container}>
      {metrics.map((metric, index) => (
        <Card key={metric.label} style={[styles.card, { width: cardWidth }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.BORDER + '40' }]}>
              <metric.icon size={18} color={colors.PRIMARY} />
            </View>
            <View style={styles.trendContainer}>
              {metric.trend === 'up' ? (
                <TrendingUp size={12} color={colors.POSITIVE} />
              ) : (
                <TrendingDown size={12} color={colors.NEGATIVE} />
              )}
              <Text
                style={[
                  styles.changeText,
                  { color: metric.trend === 'up' ? colors.POSITIVE : colors.NEGATIVE },
                ]}
              >
                {metric.change}
              </Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text variant="label" theme={theme} style={styles.label}>
              {metric.label}
            </Text>
            <Text variant="money" theme={theme} style={styles.value}>
              {metric.value}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 4,
  },
  card: {
    minWidth: 140,
    flexGrow: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
  },
});

export default MetricsCards;
