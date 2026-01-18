import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './style';
import { ChipProps } from './props';
import Text from '../Text/view';

// Tailwind class mappings for Chip
const chipClasses = {
  base: 'flex-row items-center px-md py-sm rounded-full border',
  selected: 'bg-primary border-primary',
  unselected: 'bg-transparent border-border',
  textSelected: 'text-sm text-surface font-medium',
  textUnselected: 'text-sm text-text-primary font-medium',
};

const Chip = (props: ChipProps) => {
  const { containerStyle = {}, className, theme, selected } = props;

  const { styles, colors } = useStyles(theme, props);

  // Build className if using Tailwind
  const getChipClassName = () => {
    if (!className) return undefined;
    return `${chipClasses.base} ${selected ? chipClasses.selected : chipClasses.unselected}`;
  };

  const getTextClassName = () => {
    if (!className) return undefined;
    return selected ? chipClasses.textSelected : chipClasses.textUnselected;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      className={getChipClassName()}
      style={className ? containerStyle : [styles.container, containerStyle]}>
      {props.icon !== undefined && props.icon}
      <Text
        theme={theme}
        className={getTextClassName()}
        style={className ? undefined : styles.text}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;
