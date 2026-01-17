import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import TextInput from './view';
import { COLORS } from '../../../theme';

const meta = {
  title: 'base/TextInput',
  component: TextInput,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => {
    const [text, setText] = useState('');
    return (
      <View style={{ backgroundColor: COLORS.LIGHT.BACKGROUND, padding: 16 }}>
        <TextInput label="Plain Text Input" value={text} onChangeText={setText} />
      </View>
    );
  },
};

const DARK_THEME = { base: 'Dark' as const };

export const SummaryDark: Story = {
  render: () => {
    const [text, setText] = useState('');
    return (
      <View style={{ backgroundColor: COLORS.DARK.BACKGROUND, padding: 16 }}>
        <TextInput theme={DARK_THEME} label="Plain Text Input" value={text} onChangeText={setText} />
      </View>
    );
  },
};
