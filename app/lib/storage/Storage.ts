/* eslint-disable no-bitwise */
import RNFS, {
  DownloadBeginCallbackResult,
  DownloadProgressCallbackResult,
} from 'react-native-fs';

import {versionBoum} from '@boum/constants';
import {
  createParentItemEntries,
  createSingleItemEntries,
  getDBConnection,
  updateSingleItemStatus,
} from '@boum/lib/db/service';
import {MediaItem, Session} from '@boum/types';

const path = (parentName: string, itemName: string) => {
  const path =
    RNFS.DocumentDirectoryPath +
    '/' +
    parentName.replace(/\//g, '-') +
    '/' +
    itemName.replace(/\//g, '-');
  return path;
};

const readDocumentDir = async () => {
  console.log('Path: ', RNFS.DocumentDirectoryPath);
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

const useDownloadAlbum = async (
  session: Session,
  items: Array<MediaItem>,
  album: object,
) => {
  const headers = {
    'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
  };

  const uploadBegin = (res: DownloadBeginCallbackResult) => {
    const status = 'Download started with Status' + res.statusCode;
    console.log(status);
  };

  const uploadProgress = (
    res: DownloadProgressCallbackResult,
    size: number,
  ) => {
    console.log(`Download ${~~((res.bytesWritten / size) * 100)}% completed.`);
  };

  const db = await getDBConnection();

  createParentItemEntries(db, album);

  RNFS.mkdir(
    RNFS.DocumentDirectoryPath + '/' + album.Name.replace(/\//g, '-'),
  ).catch(err => {
    console.warn('Storage: Error creating parent direcory ', err);
  });

  const imageLocation =
    RNFS.DocumentDirectoryPath +
    '/' +
    album.Name.replace(/\//g, '-') +
    '/' +
    'cover.jpg';
  RNFS.downloadFile({
    fromUrl: `${session.hostname}/Items/${album.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
    toFile: imageLocation,
    headers: headers,
    background: true,
    discretionary: true,
    cacheable: true,
  });

  let queue = [];

  items.Items.map(item => {
    const tempPath = path(item.Album, item.Name);
    let permPath: string;
    let contentType: string;
    let size: number;
    RNFS.downloadFile({
      fromUrl: `${session.hostname}/Items/${item.Id}/File`,
      toFile: tempPath,
      headers: headers,
      background: true,
      discretionary: true,
      cacheable: true,
      progressInterval: 10000,
      begin: async (res: DownloadBeginCallbackResult) => {
        uploadBegin(res);
        size = res.contentLength;
        contentType = res.headers['Content-Type'].slice(6);
        permPath = tempPath + '.' + contentType;
        queue.push({id: res.jobId, item: item, status: 'started'});

        createSingleItemEntries(db, item, permPath, album.Id, imageLocation);
      },
      progress: (res: DownloadProgressCallbackResult) => {
        uploadProgress(res, size);
      },
    })
      .promise.then(async res => {
        if (res.statusCode == 200) {
          RNFS.moveFile(tempPath, permPath)
            .then(() => {
              console.log('FILES DOWNLOADED!'),
                updateSingleItemStatus(db, item.Id, 'success');
            })
            .catch(err => {
              console.log('Error saving file to final destination: ', err);
              updateSingleItemStatus(db, item.Id, 'failure');
            });
        } else {
          updateSingleItemStatus(db, item.Id, 'failure');
        }
      })
      .catch(err => {
        if (err.description === 'cancelled') {
          updateSingleItemStatus(db, item.Id, 'failure');
        }
        updateSingleItemStatus(db, item.Id, 'failure');
      });
  });
  console.log(queue);

  return queue;
};

export {useDownloadAlbum, readDocumentDir, path};
