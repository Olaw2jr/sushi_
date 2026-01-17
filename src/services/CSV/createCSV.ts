import ReactNativeBlobUtil from 'react-native-blob-util';

// Default target directory
const targetDirectory = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}`;

export const createCSV = (fileName: string, csvString: string) => {
  const pathToWrite = `${targetDirectory}/sushi_${fileName}.csv`;
  return ReactNativeBlobUtil.fs.createFile(pathToWrite, csvString, 'utf8');
};