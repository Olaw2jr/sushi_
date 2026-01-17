import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import Picker from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'base/Picker',
  component: Picker,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Picker>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

export const Summary: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('');
    return (
      <Picker
        label="Picker"
        options={options}
        placeholder="Please select"
        selectedValue={selectedValue}
        onSelect={(v) => setSelectedValue(v)}
      />
    );
  },
};
