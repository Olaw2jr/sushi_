import { formatDate } from './formatDate';

// Timezone-naive datetime (no trailing Z/offset) is parsed as local time by
// `new Date(...)`, and `formatDate` renders in local time too, so this stays
// stable regardless of which timezone the test runner is in.
const LOCAL_DATETIME = '2024-03-15T14:30:00';

describe('formatDate', () => {
  test('formats using the default format when no option is given', () => {
    expect(formatDate(LOCAL_DATETIME)).toBe('March 15 2024 | 02:30 PM');
  });

  test('formats using a custom format option', () => {
    expect(formatDate(LOCAL_DATETIME, 'yyyy-MM-dd')).toBe('2024-03-15');
  });
});
