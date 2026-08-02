import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../../../src/components/base/Text/view';
import { COLORS } from '../../../src/theme';
import { Theme } from '../../../src/store/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT.BACKGROUND,
  },
  darkBackground: {
    backgroundColor: COLORS.DARK.BACKGROUND,
  },
});

const DARK_THEME: Theme = { base: 'Dark' };

const meta = {
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <Text variant="title">Title</Text>
      <Text variant="subtitle">Subtitle</Text>
      <Text>Body</Text>
      <Text variant="label">Label</Text>
    </View>
  ),
};

export const SummaryDark: Story = {
  render: () => (
    <View style={[styles.container, styles.darkBackground]}>
      <Text theme={DARK_THEME} variant="title">
        Title
      </Text>
      <Text theme={DARK_THEME} variant="subtitle">
        Subtitle
      </Text>
      <Text theme={DARK_THEME}>Body</Text>
      <Text theme={DARK_THEME} variant="label">
        Label
      </Text>
    </View>
  ),
};
