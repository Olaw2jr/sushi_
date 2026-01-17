import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import Text from '../Text/view';
import {
  Filters,
  Analytics,
  Category,
  Edit,
  Close,
  Settings,
  Delete,
  UpDown,
  DownLeft,
  UpRight,
  Down,
  Back,
  Add,
} from './index';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, flexDirection: 'row', flexWrap: 'wrap' },
  wrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 8,
    width: 64,
    height: 64,
  },
  text: {
    color: '#000',
    marginTop: 5,
  },
});

const SVGWrapper = ({ children, label }: { children: React.ReactNode; label: string }) => {
  return (
    <View style={styles.wrapper}>
      {children}
      <Text variant="caption" style={styles.text}>
        {label}
      </Text>
    </View>
  );
};

const meta = {
  title: 'base/SVGs',
  component: View, 
} satisfies Meta<typeof View>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: () => (
    <View style={styles.container}>
      <SVGWrapper label="Filters"><Filters fill="#000" /></SVGWrapper>
      <SVGWrapper label="Analytics"><Analytics fill="#000" /></SVGWrapper>
      <SVGWrapper label="Category"><Category fill="#000" /></SVGWrapper>
      <SVGWrapper label="Edit"><Edit fill="#000" /></SVGWrapper>
      <SVGWrapper label="Close"><Close fill="#000" /></SVGWrapper>
      <SVGWrapper label="Settings"><Settings fill="#000" /></SVGWrapper>
      <SVGWrapper label="Delete"><Delete fill="#000" /></SVGWrapper>
      <SVGWrapper label="UpDown"><UpDown fill="#000" /></SVGWrapper>
      <SVGWrapper label="DownLeft"><DownLeft fill="#000" /></SVGWrapper>
      <SVGWrapper label="UpRight"><UpRight fill="#000" /></SVGWrapper>
      <SVGWrapper label="Down"><Down fill="#000" /></SVGWrapper>
      <SVGWrapper label="Back"><Back fill="#000" /></SVGWrapper>
      <SVGWrapper label="Add"><Add fill="#000" /></SVGWrapper>
    </View>
  ),
};
