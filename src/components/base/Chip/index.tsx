import React from 'react';
import { useAppSelector } from 'store';
import { ChipProps } from './props';
import ChipView from './view';

export const Chip = (props: ChipProps) => {
  const theme = useAppSelector((state) => state.theme);
  return <ChipView theme={theme} {...props} />;
};

export default Chip;
