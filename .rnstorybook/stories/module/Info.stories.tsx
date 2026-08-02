import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Info from '../../../src/components/module/Info/view';
import { COLORS } from '../../../src/theme';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND },
});

const meta = {
  component: Info,
} satisfies Meta<typeof Info>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <Info label="Test" />
    </View>
  ),
};
