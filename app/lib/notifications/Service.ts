import {colours} from '@boum/constants';
import {MediaItem} from '@boum/types';
import notifee, {AndroidImportance} from '@notifee/react-native';

class NotificationService {
  public createDownloadNotification = async (
    list: MediaItem,
  ): Promise<string> => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'boum-downloads',
      name: 'Downloads',
      lights: false,
      vibration: true,
      sound: 'default',
      importance: AndroidImportance.LOW,
    });

    return channelId;
  };

  public updateDownloadNotification = async (
    channelId: string,
    list: MediaItem,
    totalItems: number,
    downloadedItems: number,
  ) => {
    // Display a notification
    if (downloadedItems < totalItems) {
      await notifee.displayNotification({
        id: list.Id + '-downloading',
        title: 'Downloading ' + list.Name,
        body: `Downloading ${totalItems} items`,
        android: {
          channelId: channelId,
          color: colours.accent,
          onlyAlertOnce: true,
          pressAction: {
            id: 'default',
          },
          progress: {
            max: totalItems,
            current: downloadedItems,
          },
        },
      });
    } else if (downloadedItems === totalItems) {
      await notifee.cancelNotification(list.Id + '-downloading');
      await notifee.displayNotification({
        id: list.Id + '-finished',
        title: 'Finished Downloading ' + list.Name,
        body: `Downloaded ${totalItems} items`,
        android: {
          channelId: channelId,
          color: colours.accent,
          onlyAlertOnce: true,
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  };
}

export {NotificationService};
