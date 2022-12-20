import {versionBoum} from '@boum/constants';
import {Session} from '@boum/types';

const scanLibrary = async (session: Session) => {
  let result = '';
  let numberOfMusicLibraries = 0;
  const headers = `MediaBrowser Client="Boum",DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`;

  // Check if user is  admin
  const queryUser = `${session.hostname}/Users/${session.userId}`;
  await fetch(queryUser, {
    headers: {
      Accept: 'application/json',
      'X-Emby-Authorization': headers,
    },
  }).then(async res => {
    const json = await res.json();
    // Get libraries of type ""
    if (json.Policy.IsAdministrator) {
      const queryLibraries = `${session.hostname}/Library/VirtualFolders`;
      await fetch(queryLibraries, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Emby-Authorization': headers,
        },
      }).then(async res => {
        const json = await res.json();
        const musicLibraries = json.filter(
          library => library.CollectionType === 'music',
        );
        numberOfMusicLibraries = musicLibraries.length;
        musicLibraries.forEach(async library => {
          const queryRefreshLibrary = `${session.hostname}/Items/${library.ItemId}/Refresh?Recursive=true&ImageRefreshMode=Default&MetadataRefreshMode=Default&ReplaceAllImages=false&ReplaceAllMetadata=false`;
          await fetch(queryRefreshLibrary, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'X-Emby-Authorization': headers,
            },
          }).then(async res => {
            console.log('STATUS REFRESH: ', res.status);
          });
        });
      });
      if (numberOfMusicLibraries === 1) {
        result = `Started refreshing ${numberOfMusicLibraries} music library.`;
      } else {
        result = `Started refreshing ${numberOfMusicLibraries} music libraries.`;
      }
    } else {
      result = "You aren't an admin so no library was refreshed.";
    }
  });

  return result;
};

export {scanLibrary};
