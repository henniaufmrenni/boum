import React from 'react';
import {
  Easing,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';
import ProgressBar from '@boum/components/Player/ProgressBar';
import TextTicker from '@boum/components/External/TextTicker';
import {
  MediaPlayerState,
  RemoteMediaClient,
  useStreamPosition,
} from 'react-native-google-cast';

type NowPlayingBarProps = {
  navigation: NavigationProp<any>;
};

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({navigation}) => {
  // Trackplayer
  const track = useStore(state => state.currentTrack);
  const queue = useStore(state => state.queue);
  const {position, duration} = useProgress();
  const playerState = usePlaybackState();
  const isPlaying = playerState === State.Playing;

  // Chromecast
  const castClient = useStore(state => state.castClient);
  const streamPosition = useStreamPosition();
  const mediaStatus = useStore(state => state.castMediaStatus);
  const castDevice = useStore(state => state.castDevice);

  const session = useStore(state => state.session);

  return (
    <>
      {castClient !== null && mediaStatus !== null ? (
        <>
          <NowPlayingBarContent
            navigation={navigation}
            progressValue={
              mediaStatus
                ? streamPosition / mediaStatus?.mediaInfo?.streamDuration
                : 0
            }
            artwork={`${session.hostname}/Items/${mediaStatus?.currentQueueItem?.mediaInfo.contentId}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`}
            trackTitle={mediaStatus?.mediaInfo?.metadata?.title}
            artistTitle={mediaStatus?.mediaInfo?.metadata?.albumArtist}
            isPlaying={
              mediaStatus?.playerState === MediaPlayerState.PLAYING
                ? true
                : false
            }
            castDevice={castDevice?.friendlyName}
            castClient={castClient}
          />
        </>
      ) : queue !== null && track !== null && queue[track] ? (
        <>
          <NowPlayingBarContent
            navigation={navigation}
            progressValue={position / duration}
            artwork={queue[track].artwork}
            trackTitle={queue[track].title}
            artistTitle={queue[track].artist}
            isPlaying={isPlaying}
            castDevice={''}
            castClient={null}
          />
        </>
      ) : null}
    </>
  );
};

type NowPlayingBarContentProps = {
  navigation: NavigationProp<any>;
  progressValue: number;
  artwork: string;
  trackTitle: string;
  artistTitle: string;
  isPlaying: boolean;
  castDevice: string;
  castClient: RemoteMediaClient | null;
};

const NowPlayingBarContent = ({
  navigation,
  progressValue,
  artwork,
  trackTitle,
  artistTitle,
  isPlaying,
  castDevice,
  castClient,
}: NowPlayingBarContentProps) => {
  const navigateToPlayer = () => {
    navigation.navigate('Player');
  };

  const onButtonPlayPause = async () => {
    if (castClient !== null) {
      if (isPlaying) {
        await castClient.pause();
      } else {
        await castClient.play();
      }
    } else {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };
  return (
    <>
      <TouchableHighlight onPress={navigateToPlayer}>
        <View>
          {progressValue ? <ProgressBar progress={progressValue} /> : null}
          {trackTitle !== undefined ? (
            <View style={styles.viewcontainer}>
              <FastImage
                source={{
                  uri: artwork,
                  headers: {
                    Accept: 'image/avif,image/webp,*/*',
                  },
                }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <TextTicker
                  style={styles.track}
                  duration={18000}
                  loop={true}
                  bounce={true}
                  repeatSpacer={100}
                  easing={Easing.bezier(0.37, 0, 0.63, 1)}
                  marqueeDelay={0}>
                  {trackTitle}
                </TextTicker>
                <Text
                  style={styles.artist}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {castClient !== null ? (
                    <>
                      <MaterialIcon name={'cast-connected'} size={12} />
                      {'  '}
                    </>
                  ) : null}
                  {castClient !== null ? castDevice : artistTitle}
                </Text>
              </View>
              {isPlaying ? (
                <TouchableOpacity
                  onPress={onButtonPlayPause}
                  style={styles.button}>
                  <Text>
                    <Icon name="pause" size={30} color={colours.accent} />
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onButtonPlayPause}
                  style={styles.button}>
                  <Text>
                    <Icon name="play" size={30} color={colours.accent} />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      </TouchableHighlight>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    maxHeight: 50,
    width: '100%',
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  viewcontainer: {
    backgroundColor: colours.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: '75%',
  },
  track: {
    color: colours.accent,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  artist: {
    color: colours.accent,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 5,
    margin: 5,
    marginRight: 10,
  },
  button: {
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 15,
    marginLeft: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default NowPlayingBar;
