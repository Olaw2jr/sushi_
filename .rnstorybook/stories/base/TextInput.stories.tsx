import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TextInput from '../../../src/components/base/TextInput/view';
import { COLORS } from '../../../src/theme';
import { Theme } from '../../../src/store/theme';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND },
  darkBackground: {
    backgroundColor: COLORS.DARK.BACKGROUND,
  },
});

const DARK_THEME: Theme = { base: 'Dark' };

const TextInputWrapper = ({ theme }: { theme?: Theme }) => {
  const [text, setText] = useState('');
  return (
    <TextInput
      theme={theme}
      label="Plain Text Input"
      value={text}
      onChangeText={setText}
    />
  );
};

const meta = {
  component: TextInput,
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <TextInputWrapper />
    </View>
  ),
};

export const SummaryDark: Story = {
  render: () => (
    <View style={[styles.container, styles.darkBackground]}>
      <TextInputWrapper theme={DARK_THEME} />
    </View>
  ),
};
