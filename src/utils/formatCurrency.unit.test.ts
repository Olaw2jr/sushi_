import '../infrastracture/numbro';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  test('Dynamic language', () => {
    expect(formatCurrency(1, { language: 'en-US' })).toBe('$1.00');
    expect(formatCurrency(2, { language: 'fil-PH' })).toBe('₱2.00');
    expect(formatCurrency(3, { language: 'zh-CN' })).toBe('¥3.00');
  });

  test('formats using whatever language is currently set when no format is given', () => {
    expect(formatCurrency(4)).toBe('¥4.00');
  });

  test('formats using the current language when format has no language override', () => {
    expect(formatCurrency(5, { mantissa: 0 })).toBe('¥5');
  });
});
