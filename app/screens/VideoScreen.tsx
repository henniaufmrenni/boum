import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {NavigationProp} from 'react-navigation';
import {RouteProp} from '@react-navigation/native';

import {VideoPlayer} from '@boum/components/Video';
import {LoadingSpinner} from '@boum/components/Generic';
import {useGetPlaybackInfo, useStore} from '@boum/hooks';
import {MediaItem, Session} from '@boum/types';

type VideoScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {item: MediaItem; session: Session}}>;
};

const VideoScreen = ({navigation, route}: VideoScreenProps) => {
  const {item, session} = route.params;
  const jellyfin = useStore.getState().jellyfinClient;

  const [bitrate, setBitrate] = useState<number>(session.maxBitrateVideo);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  const {playbackInfo, textStreams, sourceList} = useGetPlaybackInfo(
    item,
    session,
    bitrate,
    videoProgress,
  );

  useEffect(() => {
    // Post to '/Sessions/Playing/Stop' when stopping playback.
    const backAction = () => {
      if (
        playbackInfo !== undefined &&
        playbackInfo.Mediasources !== undefined
      ) {
        jellyfin.postProgressUpdate(
          session,
          {playableDuration: 10, currentTime: videoProgress},
          true,
          playbackInfo?.PlaySessionId,
          'Direct',
          bitrate,
          playbackInfo?.MediaSources[0]?.Id,
          'Stop',
        );
      }
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <>
      {playbackInfo && sourceList && textStreams ? (
        <VideoPlayer
          playbackInfo={playbackInfo}
          session={session}
          textTracks={textStreams}
          sourceList={sourceList}
          bitrate={bitrate}
          setBitrate={setBitrate}
          setVideoProgress={setVideoProgress}
        />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export {VideoScreen};
