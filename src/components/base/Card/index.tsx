import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card = ({ children, style }: CardProps) => {
  const theme = useSelector((state: RootState) => state.theme);
  const colors = COLORS[theme.base];

  return (
    <View
      style={[
        {
          backgroundColor: colors.AREA_HIGHLIGHT,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.BORDER,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
