import React from 'react';
import { View } from 'react-native';
import Text from 'components/base/Text';
import useStyles from './style';
import { Theme } from 'store/theme';

type Props = {
  children: React.ReactNode;
  theme: Theme;
};

export const Empty = ({ children, theme }: Props) => {
  const styles = useStyles(theme);
  return <View style={styles.container}>{children}</View>;
};

export const EmptyHeader = ({ children, theme }: Props) => {
  const styles = useStyles(theme);
  return <View style={styles.header}>{children}</View>;
};

export const EmptyMedia = ({ children, theme }: Props) => {
  const styles = useStyles(theme);
  return <View style={styles.media}>{children}</View>;
};

export const EmptyTitle = ({ children, theme }: Props) => {
  const styles = useStyles(theme);
  return (
    <Text variant="title" style={styles.title} theme={theme}>
      {children}
    </Text>
  );
};

export const EmptyDescription = ({ children, theme }: Props) => {
  const styles = useStyles(theme);
  return (
    <Text variant="body" style={styles.description} theme={theme}>
      {children}
    </Text>
  );
};

export const EmptyContent = ({ children, theme }: Props) => {
  const styles = useStyles(theme);
  return <View style={styles.content}>{children}</View>;
};
