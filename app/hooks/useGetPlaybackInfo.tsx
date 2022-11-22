import {jellyfinClient} from '@boum/lib/api';
import {MediaItem, PlaybackInfo, Session, TextTracks} from '@boum/types';
import {useEffect, useState} from 'react';
import {VideoDecoderProperties} from 'react-native-video';
import {MICROSECONDS_IN_SECONDS} from '@boum/constants';

const useGetPlaybackInfo = (
  item: MediaItem,
  session: Session,
  maxBitrateVideo: number,
  startTime: number,
) => {
  const jellyfin = new jellyfinClient();

  const [playbackInfo, setPlaybackInfo] = useState<false | PlaybackInfo>(false);
  const [sourceList, setSourceList] = useState<false | Array<object>>(false);
  const [textStreams, setTextStreams] = useState<false | Array<object>>(false);

  useEffect(() => {
    setSourceList(false);
    async function getPlaybackInfo() {
      // Check if device supports hardware HEVC decoding.
      await VideoDecoderProperties.isHEVCSupported().then(
        async (hevcSupported: boolean) => {
          await jellyfin
            .getPlaybackInfo(
              session,
              item,
              hevcSupported,
              maxBitrateVideo,
              startTime * MICROSECONDS_IN_SECONDS,
            )
            .then(playbackInfoRes => {
              setPlaybackInfo(playbackInfoRes);
              let subtitles: Array<TextTracks> = [];

              console.log(playbackInfoRes);
              // Check if the media is being transcoded and set the
              // stream URI accordingly.
              if (playbackInfoRes !== false) {
                if (
                  playbackInfoRes.MediaSources[0].TranscodingUrl !== undefined
                ) {
                  // Transcoding Source List
                  const uri = {
                    description: playbackInfoRes.MediaSources[0].Name,
                    uri:
                      session.hostname +
                      playbackInfoRes.MediaSources[0].TranscodingUrl,
                  };
                  setSourceList([uri]);
                } else {
                  // Direct Play Source List
                  const uri = {
                    description: playbackInfoRes.MediaSources[0].Name,
                    uri:
                      session.hostname +
                      '/Videos/' +
                      item.Id +
                      '/stream.' +
                      playbackInfoRes.MediaSources[0].Container +
                      '?Static=true&mediaSourceId=' +
                      item.Id +
                      '&deviceId=' +
                      session.deviceId +
                      '&api_key=' +
                      session.accessToken +
                      '&Tag=' +
                      playbackInfoRes.MediaSources[0].ETag,
                  };
                  setSourceList([uri]);
                }

                // Filter out the subtitle stream
                playbackInfoRes.MediaSources[0].MediaStreams.forEach(stream => {
                  if (
                    stream.Type === 'Subtitle' &&
                    stream.DeliveryUrl !== undefined
                  ) {
                    subtitles.push({
                      title: stream.DisplayTitle,
                      language: stream.Language,
                      type: 'text/vtt',
                      uri: session.hostname + stream.DeliveryUrl,
                    });
                  }
                });
              }
              setTextStreams(subtitles);
            });
        },
      );
    }
    getPlaybackInfo();
  }, [maxBitrateVideo]);

  return {playbackInfo, textStreams, sourceList};
};

export {useGetPlaybackInfo};
