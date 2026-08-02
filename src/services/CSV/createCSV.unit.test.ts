jest.mock('rn-fetch-blob', () => ({
  fs: {
    dirs: { DownloadDir: '/mock/downloads' },
    createFile: jest.fn().mockResolvedValue(undefined),
  },
}));

import RNFetchBlob from 'rn-fetch-blob';
import { createCSV } from './createCSV';

describe('createCSV', () => {
  test('writes the csv string to a file in the download directory', async () => {
    await createCSV('transactions_20240101', 'header\nrow');

    expect(RNFetchBlob.fs.createFile).toHaveBeenCalledWith(
      '/mock/downloads/sushi_transactions_20240101.csv',
      'header\nrow',
      'utf8',
    );
  });
});
