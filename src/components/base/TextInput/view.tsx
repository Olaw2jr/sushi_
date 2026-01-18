import React, { useState } from 'react';
import { View, TextInput as RNTextInput } from 'react-native';
import Text from 'components/base/Text/view';
import useStyles from './style';
import { TextInputPrivateProps } from './props';

// Tailwind class mappings for TextInput
const inputClasses = {
  container: '',
  label: 'text-sm font-semibold uppercase text-text-primary tracking-wider mb-sm',
  inputContainer: 'bg-surface border border-border rounded-md',
  inputContainerActive: 'border-primary',
  input: 'p-sm text-base text-text-primary',
};

const TextInput = (props: TextInputPrivateProps) => {
  const {
    containerStyle = {},
    className,
    style = {},
    theme,
    label = '',
    value = '',
    placeholder = '',
    onChangeText,
    keyboardType,
    onBlur,
    renderLabel,
    maxLength,
  } = props;
  const { styles, colors } = useStyles(theme);
  const [isSelected, setIsSelected] = useState(false);

  // Build className if using Tailwind
  const getInputContainerClassName = () => {
    if (!className) return undefined;
    let classes = inputClasses.inputContainer;
    if (isSelected) classes += ` ${inputClasses.inputContainerActive}`;
    return classes;
  };

  return (
    <View style={className ? undefined : [styles.container, containerStyle]} className={className ? inputClasses.container : undefined}>
      {renderLabel ? (
        renderLabel()
      ) : (
        <Text
          variant="label"
          className={className ? inputClasses.label : undefined}
          style={className ? undefined : styles.label}>
          {label}
        </Text>
      )}

      <View
        className={getInputContainerClassName()}
        style={className ? undefined : [
          styles.inputContainer,
          isSelected ? styles.inputContainerActive : {},
        ]}>
        <RNTextInput
          className={className ? inputClasses.input : undefined}
          style={className ? style : [styles.input, style]}
          value={value}
          maxLength={maxLength}
          onChangeText={onChangeText}
          onFocus={() => {
            setIsSelected(true);
          }}
          onBlur={() => {
            if (onBlur) {
              onBlur();
            }
            setIsSelected(false);
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.PLACE_HOLDER}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default TextInput;
