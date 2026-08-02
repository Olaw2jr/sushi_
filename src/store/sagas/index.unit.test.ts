import { all } from 'redux-saga/effects';
import root from './index';

describe('root saga', () => {
  test('forks all registered sagas (currently none)', () => {
    const generator = root();

    expect(generator.next().value).toEqual(all([]));
    expect(generator.next().done).toBe(true);
  });
});
