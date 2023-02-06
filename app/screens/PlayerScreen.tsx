import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {MediaPlayerState, useStreamPosition} from 'react-native-google-cast';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

import PlayerAlbumImage from '@boum/components/Player/PlayerImage';
import SingleItemHeader from '@boum/components/SingleItemHeader';
import {PlayerControls} from '@boum/components/Player/PlayerControls';
import {PlayerMetaControls} from '@boum/components/Player/PlayerMetaControls';
import {useStore} from '@boum/hooks';
import {colours} from '@boum/constants';
import {PlayerImageCarousel} from '@boum/components/Player';

const width = Dimensions.get('window').width;

type PlayerScreenProps = {
  navigation: NavigationProp<any>;
};

const PlayerScreen: React.FC<PlayerScreenProps> = ({navigation}) => {
  const session = useStore(state => state.session);

  const [overlayHidden, setOverlayHidden] = useState<boolean>(true);
  const {position, duration} = useProgress();
  const playerState = usePlaybackState();

  const track = useStore(state => state.currentTrack);
  const queue = useStore(state => state.queue);

  const castClient = useStore(state => state.castClient);
  const mediaStatus = useStore(state => state.castMediaStatus);
  const castDevice = useStore(state => state.castDevice);
  const streamPosition = useStreamPosition();
  const repeatMode = useStore(state => state.repeatMode);

  //  Navigate back when casting is ended
  useEffect(() => {
    if (castDevice === null && queue?.length === 0) {
      navigation.goBack();
    }
  }, [castDevice, navigation, queue?.length]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colours.grey['700'], colours.black]}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0.5, y: 0.65}}>
        <>
          {castClient !== null ? (
            <>
              <SingleItemHeader navigation={navigation} />
              <PlayerAlbumImage
                artwork={`${session.hostname}/Items/${mediaStatus?.currentQueueItem?.mediaInfo.contentId}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`}
              />
              <PlayerControls
                trackTitle={mediaStatus?.mediaInfo?.metadata?.title}
                albumTitle={mediaStatus?.mediaInfo?.metadata?.albumTitle}
                artistTitle={mediaStatus?.mediaInfo?.metadata?.artist}
                isPlaying={
                  mediaStatus?.playerState === MediaPlayerState.PLAYING
                    ? true
                    : false
                }
                isLoading={false}
                position={streamPosition && mediaStatus ? streamPosition : 0}
                duration={mediaStatus?.mediaInfo?.streamDuration}
                repeatMode={RepeatMode.Queue}
                albumNavigation={() =>
                  navigation.navigate('Album', {
                    itemId: mediaStatus?.mediaInfo?.customData.albumId,
                    item: undefined,
                  })
                }
                artistNavigation={() =>
                  navigation.navigate('Artist', {
                    itemId: mediaStatus?.mediaInfo?.customData?.artistId,
                    itemName: mediaStatus?.mediaInfo?.metadata.artist,
                    item: undefined,
                  })
                }
                skipToPreviousTrack={() => castClient.queuePrev()}
                playTrack={() => castClient.play()}
                pauseTrack={() => castClient.pause()}
                skipToNextTrack={() => castClient.queueNext()}
                seekTo={position => castClient.seek({position: position})}
                queuePosition={mediaStatus?.currentItemId}
                queueLength={2}
                castDevice={castDevice?.friendlyName}
              />
              <PlayerMetaControls
                session={session}
                navigation={navigation}
                trackId={mediaStatus?.mediaInfo?.contentId}
                trackIsFavorite={
                  mediaStatus?.mediaInfo?.customData?.isFavorite === 'true'
                    ? true
                    : false
                }
                isCastMode={castClient !== null ? true : false}
              />
            </>
          ) : track !== null && queue !== null && queue[track] ? (
            <>
              <SingleItemHeader
                mediaItem={queue[track]}
                mediaType={'Song'}
                screenMode={'PlayerView'}
                navigation={navigation}
                contextAction={() => setOverlayHidden(!overlayHidden)}
                session={session}
              />
              <PlayerImageCarousel currentTrack={track} queue={queue} />
              <PlayerControls
                trackTitle={queue[track].title}
                albumTitle={queue[track].album}
                artistTitle={queue[track].artist}
                isPlaying={playerState === State.Playing ? true : false}
                isLoading={
                  playerState === State.Connecting ||
                  playerState === State.Buffering
                    ? true
                    : false
                }
                position={position ? position : 0}
                duration={duration}
                repeatMode={repeatMode}
                albumNavigation={() =>
                  navigation.navigate('Album', {
                    itemId: queue[track].albumId,
                    item: undefined,
                  })
                }
                artistNavigation={() =>
                  navigation.navigate('Artist', {
                    itemId: queue[track].artistId,
                    itemName: queue[track].artist,
                    item: undefined,
                  })
                }
                skipToPreviousTrack={async () =>
                  await TrackPlayer.skipToPrevious()
                }
                playTrack={async () => await TrackPlayer.play()}
                pauseTrack={async () => await TrackPlayer.pause()}
                skipToNextTrack={async () => await TrackPlayer.skipToNext()}
                seekTo={async position => await TrackPlayer.seekTo(position)}
                queuePosition={track}
                queueLength={queue.length}
                castDevice={undefined}
                trackUrl={queue[track].url}
              />
              <PlayerMetaControls
                session={session}
                navigation={navigation}
                trackId={queue[track].id}
                isCastMode={false}
                trackIsFavorite={queue[track].isFavorite ? true : false}
              />
            </>
          ) : null}
        </>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    height: '100%',
    justifyContent: 'flex-start',
  },
  text: {
    color: colours.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  albumTitle: {
    fontSize: 14,
    marginHorizontal: 8,
    marginTop: 16,
    color: colours.white,
    alignSelf: 'center',
    fontFamily: 'Inter-Medium',
  },
  trackTitle: {
    fontSize: 22,
    color: colours.white,
    fontFamily: 'Inter-Bold',
    marginVertical: 4,
    alignSelf: 'center',
  },
  artistTitle: {
    fontSize: 16,
    color: colours.white,
    marginHorizontal: 4,
    alignSelf: 'center',
    fontFamily: 'Inter-Medium',
  },
  textSource: {
    fontSize: 12,
    color: colours.white,
    marginBottom: 6,
    textTransform: 'uppercase',
    fontFamily: 'Inter-Medium',
    alignSelf: 'center',
    paddingVertical: 8,
  },
  playerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerMetaControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '20%',
  },
  sliderAndPositionContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    height: 20,
    marginVertical: 10,
  },
  sliderContainer: {
    width: width * 0.68,
    marginHorizontal: 12,
    maxHeight: 10,
  },
  textSlider: {
    color: colours.white,
    fontFamily: 'Inter-Medium',
  },
  playButton: {
    marginHorizontal: 20,
  },
  controlsAndInfoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  trackTitleContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
});

export {PlayerScreen};
