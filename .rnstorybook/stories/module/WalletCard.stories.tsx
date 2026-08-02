import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import WalletCard from '../../../src/components/module/WalletCard/view';
import { COLORS } from '../../../src/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.LIGHT.BACKGROUND,
  },
  scroll: {
    height: 125,
  },
  card: {
    marginLeft: 8,
  },
});

const meta = {
  component: WalletCard,
} satisfies Meta<typeof WalletCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <WalletCard
            containerStyle={styles.card}
            label="Cash"
            balance={123456}
            language="en-US"
          />
          <WalletCard
            containerStyle={styles.card}
            label="Bank ABC"
            balance={100}
            language="en-US"
          />
          <WalletCard
            containerStyle={styles.card}
            label="Cryptowallet ABC DEF"
            balance={12345}
            language="en-US"
          />
        </ScrollView>
      </View>
    </View>
  ),
};
