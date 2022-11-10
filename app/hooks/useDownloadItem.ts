import RNFS, {
  DownloadBeginCallbackResult,
  DownloadProgressCallbackResult,
} from 'react-native-fs';
import {
  createParentItemEntries,
  createSingleItemEntries,
  getDBConnection,
  updateSingleItemStatus,
} from '@boum/lib/db/service';
import {getDownloadDirPath, path} from '@boum/lib/storage';
import {versionBoum} from '@boum/constants';
import {MediaItem, SelectedStorageLocation, Session} from '@boum/types';

const uploadBegin = (res: DownloadBeginCallbackResult) => {
  const status = 'Download started with Status' + res.statusCode;
  console.log(status);
};

const uploadProgress = (res: DownloadProgressCallbackResult, size: number) => {
  console.log(`Download ${~~((res.bytesWritten / size) * 100)}% completed.`);
};

const useDownloadItem = async (
  session: Session,
  items: Array<MediaItem>,
  album: object,
  selectedStorageLocation?: SelectedStorageLocation,
) => {
  const db = await getDBConnection();

  const downloadDirPath = getDownloadDirPath(selectedStorageLocation);
  const albumDir =
    downloadDirPath + '/' + album.Name.replace(/[/\\?%*:|"<>]/g, '-');
  const imageLocation = path(album.Name, 'cover.jpg', selectedStorageLocation);

  const headers = {
    'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
  };

  createParentItemEntries(db, album);

  RNFS.mkdir(albumDir).catch(err => {
    console.warn('Storage: Error creating parent direcory ', err);
  });

  RNFS.downloadFile({
    fromUrl: `${session.hostname}/Items/${album.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
    toFile: imageLocation,
    headers: headers,
    background: true,
    discretionary: true,
    cacheable: true,
  }).promise.catch(e => console.warn(e));

  let queue = [];

  items.Items.map(item => {
    const tempPath = path(item.Album, item.Name, selectedStorageLocation);
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

  return queue;
};

export {useDownloadItem};
