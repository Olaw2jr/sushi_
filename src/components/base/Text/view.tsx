import React from 'react';
import { View, Text as RNText } from 'react-native';
import useStyles from './style';
import { TextPrivateProps } from './props';

// Tailwind class mappings for text variants
const variantClasses: Record<string, string> = {
  title: 'text-2xl font-bold text-text-primary',
  subtitle: 'text-lg font-semibold text-text-primary',
  body: 'text-base text-text-secondary',
  label: 'text-sm font-semibold uppercase text-text-primary tracking-wider',
};

const Text = (props: TextPrivateProps) => {
  const {
    containerStyle = {},
    containerClassName,
    style = {},
    className,
    children,
    variant = 'body',
    theme,
    ...textProps
  } = props;

  const { styles, fonts } = useStyles(theme);

  // Use className if provided, otherwise fall back to StyleSheet styles
  const textClassName = className || variantClasses[variant] || variantClasses.body;

  return (
    <View style={containerStyle} className={containerClassName}>
      <RNText
        {...textProps}
        className={className ? textClassName : undefined}
        style={className ? style : [fonts[variant], style]}>
        {children}
      </RNText>
    </View>
  );
};

export default Text;
