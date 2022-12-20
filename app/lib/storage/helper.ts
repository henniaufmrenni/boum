import RNFS from 'react-native-fs';

import {SelectedStorageLocation} from '@boum/types';

const getDownloadDirPath = (
  selectedStorageLocation?: SelectedStorageLocation,
) => {
  console.log('SELECTED PATH', selectedStorageLocation);
  let downloadDirPath: string;
  if (selectedStorageLocation === 'DownloadDirectory') {
    downloadDirPath = RNFS.DownloadDirectoryPath;
    console.log('DownloadDirectory', downloadDirPath);
  } else if (selectedStorageLocation === 'ExternalDirectory') {
    downloadDirPath = RNFS.ExternalStorageDirectoryPath + '/Download';
  } else {
    downloadDirPath = RNFS.DocumentDirectoryPath;
  }
  console.log('DIR PATH', downloadDirPath);
  return downloadDirPath;
};

const path = (
  parentName: string,
  itemName: string,
  selectedStorageLocation?: SelectedStorageLocation,
) => {
  let downloadDirPath = getDownloadDirPath(selectedStorageLocation);
  let path: string;
  path =
    downloadDirPath +
    '/' +
    parentName.replace(/[/\\?%*:|"<>]/g, '-') +
    '/' +
    itemName.replace(/[/\\?%*:|"<>]/g, '-');
  return path;
};

const readDocumentDir = async () => {
  RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then(result => {
      console.log('GOT RESULT', result);
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then(statResult => {
      if (statResult[0].isFile()) {
        return RNFS.readFile(statResult[1], 'utf8');
      }
      return 'no file';
    })
    .then(contents => {
      console.log(contents);
    })
    .catch(err => {
      console.log(err.message, err.code);
    });
};

export {readDocumentDir, path, getDownloadDirPath};
