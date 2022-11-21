import TrackPlayer from 'react-native-track-player';

import {versionBoum} from '@boum/constants';
import {getDBConnection, readFileLocationItem} from '@boum/lib/db/service';
import {shuffleArray} from '@boum/lib/helper/helper';
import {MediaItem, Session, TrackBoum} from '@boum/types';

// TODO: convert this to a class
const playAlbum = async (
  jellyfinInput: Array<MediaItem>,
  session: Session,
  bitrateLimit: number,
) => {
  console.log('Jellyfin Input', jellyfinInput);
  await mapJellyfinTrackToPlayer(jellyfinInput, session, bitrateLimit)
    .then(async object => {
      await TrackPlayer.reset();
      console.log(object);
      await TrackPlayer.add(object).catch(err => console.log(err));
      await TrackPlayer.play();
    })
    .catch(() => console.warn('Error playing album'));
};

const playShuffleList = async (
  jellyfinInput: Array<MediaItem>,
  session: Session,
  bitrateLimit: number,
) => {
  const trackObject = await mapJellyfinTrackToPlayer(
    jellyfinInput,
    session,
    bitrateLimit,
  );
  const shuffledTrackObject = shuffleArray(trackObject);
  await TrackPlayer.reset();
  await TrackPlayer.add(shuffledTrackObject);
  await TrackPlayer.play();
};

const addAlbumToQueue = async (
  jellyfinInput: Array<MediaItem>,
  session: Session,
  bitrateLimit: number,
  currentTrack?: number,
) => {
  const trackObject = await mapJellyfinTrackToPlayer(
    jellyfinInput,
    session,
    bitrateLimit,
  );
  await TrackPlayer.add(trackObject, currentTrack);
  await TrackPlayer.play();
};

const playAudio = async (
  jellyfinInput: Array<MediaItem>,
  listNumber: number,
  session: Session,
  bitrateLimit: number,
) => {
  const trackObject = await mapJellyfinTrackToPlayer(
    jellyfinInput,
    session,
    bitrateLimit,
  );
  await TrackPlayer.reset();
  await TrackPlayer.add(trackObject);
  await TrackPlayer.skip(listNumber);
  await TrackPlayer.play();
};

const playTrack = async (
  jellyfinInput: MediaItem,
  session: Session,
  bitrateLimit: number,
) => {
  const trackObject = await mapJellyfinTrackToPlayer(
    [jellyfinInput],
    session,
    bitrateLimit,
  );
  await TrackPlayer.reset();
  await TrackPlayer.add(trackObject);
  await TrackPlayer.play();
};

// FIXME: Fetch Album data for each item.Id
const playArtist = async (jellyfinInput, session) => {
  // const albums = jellyfinInput.forEach(getAlbum(item.Id))
  //
  //console.log('Input: ', jellyfinInput);
  //const trackObject = jellyfinInput.map(item => mapJellyfinTrackToPlayer(item));
  //console.log(trackObject);
  //await TrackPlayer.reset();
  //await TrackPlayer.add(trackObject);
  //await TrackPlayer.play();
};

const mapJellyfinTrackToPlayer = async (
  jellyfinInput: Array<MediaItem>,
  session: Session,
  bitrateLimit: number,
): Promise<Array<TrackBoum>> => {
  const db = await getDBConnection();

  const tracks: Promise<Array<TrackBoum>> = new Promise(function (
    resolve,
    reject,
  ) {
    let tracks: Array<TrackBoum> = [];
    jellyfinInput.forEach(async (inputItem, index) => {
      const localFile = await readFileLocationItem(db, inputItem.Id);
      if (localFile[0] !== undefined && localFile[0].status === 'success') {
        //console.log('Player: Playing local audio ', inputItem.Name);
        const track: TrackBoum = {
          title: inputItem.Name,
          id: inputItem.Id,
          artist: inputItem.AlbumArtist,
          artistId: jellyfinInput[0].AlbumArtists[0].Id,
          album: inputItem.Album,
          albumId: jellyfinInput[0].AlbumId,
          date: inputItem.PremiereDate,
          duration: (inputItem.RunTimeTicks / 1000).toFixed(0),
          isFavorite: inputItem.UserData.IsFavorite,
          url: `file://${localFile[0].fileLocation}`,
          artwork: `file://${localFile[0].imageLocation}`,
          headers: {
            'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
          },
        };
        tracks.push(track);
      } else if (bitrateLimit !== 140000000) {
        //console.log('Player: Transcoding audio ', inputItem.Name);
        const track: TrackBoum = {
          title: inputItem.Name,
          id: inputItem.Id,
          artist: inputItem.AlbumArtist,
          artistId: jellyfinInput[0].AlbumArtists[0].Id,
          album: inputItem.Album,
          albumId: jellyfinInput[0].AlbumId,
          date: inputItem.PremiereDate,
          duration: (inputItem.RunTimeTicks / 1000).toFixed(0),
          isFavorite: inputItem.UserData.IsFavorite,
          url: `${session.hostname}/Audio/${inputItem.Id}/stream.aac?UserId=${session.userId}&MaxStreamingBitrate=${bitrateLimit}&TranscodingContainer=ts&TranscodingProtocol=hls&AudioCodec=aac&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&static=true`,
          artwork: `${session.hostname}/Items/${inputItem.AlbumId}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
          headers: {
            'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
          },
        };
        tracks.push(track);
      } else {
        //console.log('Player: Not transcoding audio ', inputItem.Name);
        const track: TrackBoum = {
          title: inputItem.Name,
          id: inputItem.Id,
          artist: inputItem.AlbumArtist,
          artistId: jellyfinInput[0].AlbumArtists[0].Id,
          album: inputItem.Album,
          albumId: jellyfinInput[0].AlbumId,
          date: inputItem.PremiereDate,
          duration: (inputItem.RunTimeTicks / 1000).toFixed(0),
          isFavorite: inputItem.UserData.IsFavorite,
          url: `${session.hostname}/Audio/${inputItem.Id}/universal?UserId=${session.userId}&MaxStreamingBitrate=140000000&Container=opus,webm|opus,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg&TranscodingContainer=ts&TranscodingProtocol=hls&AudioCodec=aac&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&static=true`,
          artwork: `${session.hostname}/Items/${inputItem.AlbumId}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
          headers: {
            'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
          },
        };
        tracks.push(track);
      }
      if (jellyfinInput.length === index + 1) {
        resolve(tracks);
      }
    });
  });

  return tracks;
};

export {
  playAudio,
  playAlbum,
  addAlbumToQueue,
  playArtist,
  playTrack,
  playShuffleList,
};
