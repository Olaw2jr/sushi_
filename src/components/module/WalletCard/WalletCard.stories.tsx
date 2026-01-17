import React from 'react';
import { View, ScrollView } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import WalletCard from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'module/WalletCard',
  component: WalletCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof WalletCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={{ height: 125 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <WalletCard
          containerStyle={{ marginLeft: 8 }}
          label="Cash"
          balance={123456}
        />
        <WalletCard
          containerStyle={{ marginLeft: 8 }}
          label="Bank ABC"
          balance={100}
        />
        <WalletCard
          containerStyle={{ marginLeft: 8 }}
          label="Cryptowallet ABC DEF"
          balance={12345}
        />
      </ScrollView>
    </View>
  ),
};
