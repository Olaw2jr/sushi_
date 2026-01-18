import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import useStyles from './style';
import { ButtonPrivateProps } from './props';

// Tailwind class mappings for button variants
const buttonClasses = {
  base: 'h-10 justify-center items-center rounded-md flex-row px-md',
  primary: 'bg-primary',
  outline: 'bg-transparent border-2 border-primary',
  disabled: 'bg-text-disabled',
  outlineDisabled: 'border-text-disabled',
  text: 'text-xs font-bold uppercase tracking-wider text-surface',
  outlineText: 'text-xs font-bold uppercase tracking-wider text-text-primary',
};

const Button = (props: ButtonPrivateProps) => {
  const {
    containerStyle = {},
    className,
    theme,
    onPress,
    label,
    outline,
    disabled,
    loading,
  } = props;

  const { styles, colors } = useStyles(theme);

  // Build className if using Tailwind
  const getButtonClassName = () => {
    if (!className) return undefined;
    let classes = buttonClasses.base;
    classes += outline ? ` ${buttonClasses.outline}` : ` ${buttonClasses.primary}`;
    if (disabled) {
      classes += outline ? ` ${buttonClasses.outlineDisabled}` : ` ${buttonClasses.disabled}`;
    }
    return classes;
  };

  const getTextClassName = () => {
    if (!className) return undefined;
    return outline ? buttonClasses.outlineText : buttonClasses.text;
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      className={getButtonClassName()}
      style={className ? containerStyle : [
        outline ? styles.outlineContainer : styles.container,
        containerStyle,
        disabled
          ? outline
            ? styles.outlineContainerDisabled
            : styles.containerDisabled
          : {},
      ]}
      onPress={onPress}>
      <Text
        className={getTextClassName()}
        style={className ? undefined : [outline ? styles.outlineText : styles.text]}>
        {label}
      </Text>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.PRIMARY} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
