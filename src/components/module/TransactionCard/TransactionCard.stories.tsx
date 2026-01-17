import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import TransactionCard from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'module/TransactionCard',
  component: TransactionCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TransactionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View>
      <TransactionCard
        containerStyle={{ marginTop: 8 }}
        category="Subscription"
        amount={123456}
        paidAt={new Date().toISOString()}
        sourceWallet="Credit Card"
      />
      <TransactionCard
        containerStyle={{ marginTop: 8 }}
        category="Food"
        amount={100}
        paidAt={new Date().toISOString()}
        sourceWallet="Savings Bank"
      />
      <TransactionCard
        containerStyle={{ marginTop: 8 }}
        category="Shopping"
        amount={12345}
        paidAt={new Date().toISOString()}
        sourceWallet="Cash"
      />
    </View>
  ),
};
