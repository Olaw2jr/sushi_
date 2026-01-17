import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import Info from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'module/Info',
  component: Info,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Info>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  args: {
    label: 'Test',
  },
};
