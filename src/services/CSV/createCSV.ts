import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

// Default target directory
const targetDirectory = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}`;

export const createCSV = (fileName: string, csvString: string) => {
  const targetFileName = `sushi_${fileName}.csv`;

  // Android 10+ (API 29+) enforces scoped storage: writing to
  // dirs.DownloadDir only ever reaches an app-private folder, invisible
  // to the user. The public Downloads collection has to be written via
  // MediaCollection, which doesn't exist pre-Q, so older Android keeps
  // the plain path-based write below.
  if (Platform.OS === 'android' && Platform.Version >= 29) {
    const tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${targetFileName}`;
    return ReactNativeBlobUtil.fs
      .writeFile(tempPath, csvString, 'utf8')
      .then(() =>
        ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          { name: targetFileName, parentFolder: '', mimeType: 'text/csv' },
          'Download',
          tempPath,
        ),
      );
  }

  const pathToWrite = `${targetDirectory}/${targetFileName}`;
  return ReactNativeBlobUtil.fs.createFile(pathToWrite, csvString, 'utf8');
};
