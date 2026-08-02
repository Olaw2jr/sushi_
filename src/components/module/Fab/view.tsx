import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import useStyles from './style';
import { FabProps } from './props';

const Fab = (props: FabProps) => {
  const { containerStyle = {}, theme, onPress } = props;

  const { styles, colors } = useStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      activeOpacity={0.8}>
      <Plus size={24} color={colors.ON_ACCENT} />
    </TouchableOpacity>
  );
};

export default Fab;
