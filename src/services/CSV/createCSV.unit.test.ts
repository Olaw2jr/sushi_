jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: { DownloadDir: '/mock/downloads', CacheDir: '/mock/cache' },
    createFile: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
  },
  MediaCollection: {
    copyToMediaStore: jest.fn().mockResolvedValue('content://mock-uri'),
  },
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  __esModule: true,
  default: { OS: 'ios', Version: '17.0' },
}));

import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { createCSV } from './createCSV';

const setPlatform = (os: string, version: number | string) => {
  const mutablePlatform = Platform as unknown as {
    OS: string;
    Version: number | string;
  };
  mutablePlatform.OS = os;
  mutablePlatform.Version = version;
};

describe('createCSV', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Android 10+ (API 29+) writes to a private cache file, then copies it into the public Downloads media collection', async () => {
    setPlatform('android', 29);

    await createCSV('transactions_20240101', 'header\nrow');

    expect(ReactNativeBlobUtil.fs.writeFile).toHaveBeenCalledWith(
      '/mock/cache/sushi_transactions_20240101.csv',
      'header\nrow',
      'utf8',
    );
    expect(ReactNativeBlobUtil.MediaCollection.copyToMediaStore).toHaveBeenCalledWith(
      {
        name: 'sushi_transactions_20240101.csv',
        parentFolder: '',
        mimeType: 'text/csv',
      },
      'Download',
      '/mock/cache/sushi_transactions_20240101.csv',
    );
    expect(ReactNativeBlobUtil.fs.createFile).not.toHaveBeenCalled();
  });

  test('Android below API 29 falls back to writing the file directly to the app download directory', async () => {
    setPlatform('android', 28);

    await createCSV('transactions_20240101', 'header\nrow');

    expect(ReactNativeBlobUtil.fs.createFile).toHaveBeenCalledWith(
      '/mock/downloads/sushi_transactions_20240101.csv',
      'header\nrow',
      'utf8',
    );
    expect(ReactNativeBlobUtil.MediaCollection.copyToMediaStore).not.toHaveBeenCalled();
  });

  test('iOS writes the csv string to a file in the download directory', async () => {
    setPlatform('ios', '17.0');

    await createCSV('transactions_20240101', 'header\nrow');

    expect(ReactNativeBlobUtil.fs.createFile).toHaveBeenCalledWith(
      '/mock/downloads/sushi_transactions_20240101.csv',
      'header\nrow',
      'utf8',
    );
    expect(ReactNativeBlobUtil.MediaCollection.copyToMediaStore).not.toHaveBeenCalled();
  });
});
