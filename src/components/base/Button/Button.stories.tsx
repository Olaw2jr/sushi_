import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import Button from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'base/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Button label="Primary Button" />
      <Button label="Secondary Button" outline />
      <Button label="Disabled Primary Button" disabled />
      <Button label="Disabled Secondary Button" outline disabled />
    </View>
  ),
};

const DARK_THEME = { base: 'Dark' as const };

export const SummaryDark: Story = {
  render: () => (
    <View style={{ backgroundColor: COLORS.DARK.BACKGROUND, padding: 16, gap: 8 }}>
      <Button theme={DARK_THEME} label="Primary Button" />
      <Button theme={DARK_THEME} label="Secondary Button" outline />
      <Button theme={DARK_THEME} label="Disabled Primary Button" disabled />
      <Button theme={DARK_THEME} label="Disabled Secondary Button" outline disabled />
    </View>
  ),
};
