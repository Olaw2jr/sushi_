import numbro from 'numbro';
import { omit } from 'ramda';

type Format = numbro.Format & { language?: string };

export const formatCurrency = (number: number, format?: Format) => {
  if (format?.language) {
    numbro.setLanguage(format?.language);
  }
  
  const safeNumber = isNaN(number) ? 0 : number;

  return numbro(safeNumber).formatCurrency({
    mantissa: 2,
    ...omit(['language'], format),
  });
};
