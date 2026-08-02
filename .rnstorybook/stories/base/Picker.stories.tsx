import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Picker from '../../../src/components/base/Picker/view';
import { COLORS } from '../../../src/theme';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND },
});

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

const PickerWrapper = () => {
  const [selectedValue, setSelectedValue] = useState('');
  return (
    <Picker
      label="Picker"
      options={options}
      placeholder="Please select"
      selectedValue={selectedValue}
      onSelect={(value) => value && setSelectedValue(value)}
    />
  );
};

const meta = {
  component: Picker,
} satisfies Meta<typeof Picker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <PickerWrapper />
    </View>
  ),
};
