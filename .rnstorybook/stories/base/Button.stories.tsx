import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../../src/components/base/Button/view';
import { COLORS } from '../../../src/theme';
import { Theme } from '../../../src/store/theme';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.LIGHT.BACKGROUND },
  button: { marginTop: 8 },
  darkBackground: {
    backgroundColor: COLORS.DARK.BACKGROUND,
  },
});

const DARK_THEME: Theme = { base: 'Dark' };

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <Button label="Primary Button" />
      <Button containerStyle={styles.button} label="Secondary Button" outline />
      <Button
        containerStyle={styles.button}
        label="Disabled Primary Button"
        disabled
      />
      <Button
        containerStyle={styles.button}
        label="Disabled Secondary Button"
        outline
        disabled
      />
    </View>
  ),
};

export const SummaryDark: Story = {
  render: () => (
    <View style={[styles.container, styles.darkBackground]}>
      <Button theme={DARK_THEME} label="Primary Button" />
      <Button
        theme={DARK_THEME}
        containerStyle={styles.button}
        label="Secondary Button"
        outline
      />
      <Button
        theme={DARK_THEME}
        containerStyle={styles.button}
        label="Disabled Primary Button"
        disabled
      />
      <Button
        theme={DARK_THEME}
        containerStyle={styles.button}
        label="Disabled Secondary Button"
        outline
        disabled
      />
    </View>
  ),
};
