import RNFS, {
  DownloadBeginCallbackResult,
  DownloadProgressCallbackResult,
} from 'react-native-fs';
import {DbService} from '@boum/lib/db';

import {versionBoum} from '@boum/constants';
import {
  DownloadListType,
  DownloadQueueItem,
  DownloadStatus,
  LibraryItemList,
  MediaItem,
  MediaType,
  SelectedStorageLocation,
  Session,
} from '@boum/types';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

class StorageService {
  dbService = new DbService();

  getAuthenticationHeaders = (session: Session) => {
    return {
      'X-Emby-Authorization': `MediaBrowser Client="boum", Device="boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
    };
  };

  getDownloadDirectoryPath = (
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

  sanitizePath = (path: string) => {
    return path.replace(/[/\\?%*':|"<>]/g, '-');
  };

  getPath = (
    selectedStorageLocation: SelectedStorageLocation,
    parentName: string,
    childName?: string,
  ) => {
    let downloadDirPath = this.getDownloadDirectoryPath(
      selectedStorageLocation,
    );

    let path: string;

    if (childName !== undefined) {
      path =
        downloadDirPath +
        '/' +
        this.sanitizePath(parentName) +
        '/' +
        this.sanitizePath(childName);
    } else {
      path = downloadDirPath + '/' + this.sanitizePath(parentName) + '/';
    }

    return path;
  };

  writeScheduledDownloadsToDb = (
    db: SQLiteDatabase,

    listItems: LibraryItemList,
    listInfo: MediaItem,
    selectedStorageLocation: SelectedStorageLocation,
    imageLocation: string,
  ) => {
    this.dbService.createParentItemEntries(db, listInfo);

    listItems.Items.forEach(item => {
      const itemPath = this.getPath(
        selectedStorageLocation,
        listInfo.Name,
        item.Name,
      );
      console.log('ItemPath ', itemPath);

      this.dbService
        .createSingleItemEntries(db, item, itemPath, listInfo.Id, imageLocation)
        .catch(e => console.warn(e));
    });
  };

  downloadItem = async (
    db: SQLiteDatabase,
    id: string,
    tempPath: string,
    session: Session,
  ) => {
    const headers = this.getAuthenticationHeaders(session);
    let permPath: string;
    const job: Promise<DownloadQueueItem> = new Promise((resolve, reject) => {
      RNFS.downloadFile({
        fromUrl:
          session.maxBitrateDownloadAudio !== 140000000
            ? `${session.hostname}/Audio/${id}/stream.aac?UserId=${session.userId}&MaxStreamingBitrate=${session.maxBitrateDownloadAudio}&audioBitRate=${session.maxBitrateDownloadAudio}&TranscodingContainer=ts&TranscodingProtocol=hls&EnableRedirection=true&EnableRemoteMedia=false&static=false`
            : `${session.hostname}/Items/${id}/File`,
        toFile: tempPath,
        headers: headers,
        background: true,
        discretionary: true,
        cacheable: true,
        progressInterval: 10000,
        begin: async (res: DownloadBeginCallbackResult) => {
          console.log('Download started with Status' + res.statusCode);
          const contentType = res.headers['Content-Type'].slice(6);
          permPath = tempPath + '.' + contentType;
        },
        progress: (res: DownloadProgressCallbackResult) => {
          console.log(
            `Download ${~~(
              (res.bytesWritten / res.contentLength) *
              100
            )}% completed.`,
          );
        },
      })
        .promise.then(async res => {
          RNFS.moveFile(tempPath, permPath)
            .then(() => {
              console.log('FILES DOWNLOADED AND MOVED!');
              this.dbService.updateSingleItemStatus(
                db,
                id,
                DownloadStatus.Success,
                permPath,
              );
              const job = {
                jobId: res.jobId,
                itemId: id,
                status: DownloadStatus.Success,
              };
              resolve(job);
            })
            .catch(err => {
              console.log('Error saving file to final destination: ', err);
              this.dbService.updateSingleItemStatus(
                db,
                id,
                DownloadStatus.Failure,
                tempPath,
              );
              const job = {
                jobId: res.jobId,
                itemId: id,
                status: DownloadStatus.Failure,
              };
              reject(job);
            });
        })
        .catch(() => {
          this.dbService.updateSingleItemStatus(
            db,
            id,
            DownloadStatus.Failure,
            tempPath,
          );
          const job = {
            jobId: 0,
            itemId: id,
            status: DownloadStatus.Failure,
          };
          reject(job);
        });
    });

    return job;
  };

  public redownloadItems = async (session: Session) => {
    const db = await this.dbService.getDBConnection();
    let queue: Array<DownloadQueueItem> = [];

    this.dbService.readUnfinishedDownloads(db).then(async items => {
      console.log(items);
      for (let i = 0; i < items.length; ) {
        const item = items[i];
        console.log(item);
        await this.downloadItem(db, item.id, item.fileLocation, session).then(
          res => {
            console.log(res);
            i++;
          },
        );
      }
    });
  };

  public downloadList = async (
    session: Session,
    items: LibraryItemList,
    list: MediaItem,
    mediaType: MediaType,
  ) => {
    const db = await this.dbService.getDBConnection();

    const listDir = this.getPath(session.selectedStorageLocation, list.Name);

    if (mediaType === 'Playlist') {
      RNFS.mkdir(listDir).catch(err => {
        console.warn('Storage: Error creating parent direcory ', err);
      });

      this.dbService.createParentItemEntries(db, list);

      items.Items.forEach(item => {
        const itemPath = this.getPath(
          session.selectedStorageLocation,
          list.Name,
          item.Name,
        );
        const imageLocation = listDir + this.sanitizePath(item.Name) + '.jpg';
        this.dbService
          .createSingleItemEntries(db, item, itemPath, list.Id, imageLocation)
          .catch(e => console.warn(e));

        RNFS.downloadFile({
          fromUrl: `${session.hostname}/Items/${item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
          toFile: imageLocation,
          headers: headers,
          background: true,
          discretionary: true,
          cacheable: true,
        }).promise.catch(e => console.warn(e));
      });

      const headers = this.getAuthenticationHeaders(session);

      for (let i = 0; i < items.Items.length; ) {
        const item = items.Items[i];
        const tempPath = this.getPath(
          session.selectedStorageLocation,
          list.Name,
          item.Name,
        );
        await this.downloadItem(db, item.Id, tempPath, session).then(res => {
          console.log(res);
          i++;
        });
      }
    } else if (mediaType === 'Album') {
      const imageLocation = listDir + 'cover.jpg';
      const headers = this.getAuthenticationHeaders(session);

      this.writeScheduledDownloadsToDb(
        db,
        items,
        list,
        session.selectedStorageLocation,
        imageLocation,
      );

      RNFS.mkdir(listDir).catch(err => {
        console.warn('Storage: Error creating parent direcory ', err);
      });

      RNFS.downloadFile({
        fromUrl: `${session.hostname}/Items/${list.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
        toFile: imageLocation,
        headers: headers,
        background: true,
        discretionary: true,
        cacheable: true,
      }).promise.catch(e => console.warn(e));

      for (let i = 0; i < items.Items.length; ) {
        const item = items.Items[i];
        const tempPath = this.getPath(
          session.selectedStorageLocation,
          item.Album,
          item.Name,
        );

        await this.downloadItem(db, item.Id, tempPath, session).then(res => {
          console.log(res);
          i++;
        });
      }
    }
  };
}

export {StorageService};
