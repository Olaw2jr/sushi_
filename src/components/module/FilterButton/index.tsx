import { SlidersHorizontal } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useAppSelector } from 'store';
import { COLORS } from 'theme';

export type FilterButtonProps = {
  containerStyle?: ViewStyle;
  onPress?: () => void;
};
const FilterButton = (props: FilterButtonProps) => {
  const theme = useAppSelector((state) => state.theme);
  const colors = COLORS[theme.base];
  const filters = useAppSelector((state) => state.filters);
  const hasActiveFilter =
    filters.accountId !== null ||
    filters.startDate !== null ||
    filters.searchTerm.length > 0 ||
    filters.transactionType !== null;
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
        ...(props.containerStyle || {}),
      }}
      activeOpacity={0.8}
      onPress={() => {
        props.onPress?.();
      }}>
      <View style={{ flexDirection: 'row' }}>
        <SlidersHorizontal size={24} color={colors.PRIMARY_TEXT} />
        {hasActiveFilter && (
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: colors.PRIMARY,
              borderRadius: 4,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FilterButton;
