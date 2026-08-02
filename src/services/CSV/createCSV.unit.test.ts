jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: { DownloadDir: '/mock/downloads' },
    createFile: jest.fn().mockResolvedValue(undefined),
  },
}));

import ReactNativeBlobUtil from 'react-native-blob-util';
import { createCSV } from './createCSV';

describe('createCSV', () => {
  test('writes the csv string to a file in the download directory', async () => {
    await createCSV('transactions_20240101', 'header\nrow');

    expect(ReactNativeBlobUtil.fs.createFile).toHaveBeenCalledWith(
      '/mock/downloads/sushi_transactions_20240101.csv',
      'header\nrow',
      'utf8',
    );
  });
});
