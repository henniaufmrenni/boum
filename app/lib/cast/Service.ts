import {LibraryItemList, MediaItem, Session, TrackBoum} from '@boum/types';
import {
  MediaHlsSegmentFormat,
  MediaQueueData,
  MediaQueueItem,
  MediaQueueType,
  MediaStreamType,
  RemoteMediaClient,
} from 'react-native-google-cast';

class CastService {
  public async playTrack(
    session: Session,
    song: MediaItem,
    startIndex: number,
    client: RemoteMediaClient,
  ) {
    await this.mapJellyfinQueueToCast(
      session,
      {Items: [song], StartIndex: 0, TotalRecordCount: 1},
      startIndex,
    ).then(queue => {
      if (queue !== null) {
        client.loadMedia({queueData: queue, autoplay: true});
      }
    });
  }

  public async playAlbum(
    session: Session,
    mediaItems: LibraryItemList,
    startIndex: number,
    client: RemoteMediaClient,
  ) {
    await this.mapJellyfinQueueToCast(session, mediaItems, startIndex).then(
      queue => {
        if (queue !== null) {
          client.loadMedia({queueData: queue, autoplay: true});
        }
      },
    );
  }

  public mapJellyfinQueueToCast(
    session: Session,
    mediaItems: LibraryItemList,
    startIndex: number,
  ) {
    return new Promise<MediaQueueData>(function (resolve, _reject) {
      let mediaQueue: MediaQueueData = {
        items: [],
        startIndex: startIndex,
        type: MediaQueueType.ALBUM,
      };

      mediaItems.Items.forEach((item, index) => {
        const castItem: MediaQueueItem = {
          mediaInfo: {
            contentUrl:
              `${
                session.chromecastAdressEnabled
                  ? session.chromecastAdress
                  : session.hostname
              }/audio/${item.Id}/universal?UserId=${
                session.userId
              }&MaxStreamingBitrate=140000000&Container=opus,webm|opus,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg&TranscodingContainer=ts&TranscodingProtocol=hls&AudioCodec=mp3` +
              '&static=true' +
              '&deviceId=' +
              session.deviceId +
              '&api_key=' +
              session.accessToken,
            contentId: item.Id,
            streamType: MediaStreamType.BUFFERED,
            metadata: {
              type: 'musicTrack',
              title: item.Name,
              artist: item.AlbumArtist,
              albumTitle: item.Album,
              releaseDate: item.PremiereDate,
              trackNumber: index + 1,
              images: [
                {
                  height: 400,
                  width: 400,
                  url: `${session.hostname}/Items/${item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                },
              ],
            },
            customData: {
              albumId: item.AlbumId,
              isFavorite: item.UserData.IsFavorite.toString(),
              artistId: item.AlbumArtists[0].Id,
            },
          },
        };

        mediaQueue.items?.push(castItem);
        if (mediaQueue.items?.length === index + 1) {
          resolve(mediaQueue);
        }
      });
    });
  }

  public mapTrackPlayerQueueToCast(
    queue: Array<TrackBoum>,
    session: Session,
    startIndex: number,
  ) {
    return new Promise<MediaQueueData>(function (resolve, _reject) {
      let mediaQueue: MediaQueueData = {
        items: [],
        containerMetadata: {
          containerImages: [{height: 400, width: 400, url: queue[0].artwork}],
        },
        startIndex: startIndex,
        type: MediaQueueType.ALBUM,
      };

      queue.forEach((item, index) => {
        const castItem: MediaQueueItem = {
          mediaInfo: {
            contentUrl: item.url.toString().includes('file:///')
              ? `${
                  session.chromecastAdressEnabled
                    ? session.chromecastAdress
                    : session.hostname
                }/audio/${item.id}/universal?UserId=${
                  session.userId
                }&MaxStreamingBitrate=140000000&Container=opus,webm|opus,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg&TranscodingContainer=ts&TranscodingProtocol=hls&AudioCodec=mp3` +
                '&static=true' +
                '&deviceId=' +
                session.deviceId +
                '&api_key=' +
                session.accessToken
              : session.chromecastAdress
              ? item.url
                  .toString()
                  .replace(session.hostname, session.chromecastAdress)
              : item.url.toString(),
            contentId: item.id,
            hlsSegmentFormat: item.url.toString().includes('&static=false')
              ? MediaHlsSegmentFormat.TS
              : undefined,
            streamType: MediaStreamType.BUFFERED,
            metadata: {
              type: 'musicTrack',
              title: item.title,
              artist: item.artist,
              albumTitle: item.album,
              releaseDate: item.date,
              trackNumber: index + 1,
              images: [
                {
                  height: 400,
                  width: 400,
                  url: item.artwork,
                },
              ],
            },
            customData: {
              albumId: item.albumId,
              isFavorite: item.isFavorite.toString(),
              artistId: item.artistId,
            },
          },
        };

        mediaQueue.items.push(castItem);
        if (mediaQueue.items.length === index + 1) {
          resolve(mediaQueue);
        }
      });
    });
  }
}

export {CastService};
