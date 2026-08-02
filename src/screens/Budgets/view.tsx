import React from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { BudgetsProps } from './props';
import Text from 'components/base/Text';
import TextView from 'components/base/Text/view';

const BudgetsView = (_props: BudgetsProps) => {
  const { styles, theme, colors } = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={styles.header}>
        <Text variant="title" theme={theme} translationKey="BUDGETS" />
      </View>
      <View style={styles.content}>
        <TextView variant="subtitle" theme={theme}>
          Budgets are coming soon
        </TextView>
        <TextView variant="body" theme={theme} style={styles.body}>
          Set monthly limits per category and see what's left to spend, at a
          glance.
        </TextView>
      </View>
    </SafeAreaView>
  );
};

export default BudgetsView;
