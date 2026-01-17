import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import Chip from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'base/Chip',
  component: Chip,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  args: {
    label: 'Chip',
    theme: { base: 'Light' },
  },
};