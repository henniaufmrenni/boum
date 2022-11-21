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

import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';
import ProgressBar from '@boum/components/Player/ProgressBar';
import TextTicker from '@boum/components/External/TextTicker';

type NowPlayingBarProps = {
  navigation: NavigationProp<any>;
};

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({navigation}) => {
  const {position, duration} = useProgress();
  const progressValue = position / duration;

  const track = useStore.getState().currentTrack;
  const queue = useStore.getState().queue;

  const playerState = usePlaybackState();
  const isPlaying = playerState === State.Playing;

  return (
    <>
      {queue && queue[track] ? (
        <TouchableHighlight onPress={() => navigation.navigate('Player')}>
          <View>
            {progressValue ? <ProgressBar /> : null}
            {track !== undefined && queue ? (
              <View style={styles.viewcontainer}>
                <FastImage
                  source={{
                    uri: queue[track].artwork,
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
                    {queue[track].title}
                  </TextTicker>
                  <Text
                    style={styles.artist}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {queue[track].artist}
                  </Text>
                </View>
                {isPlaying ? (
                  <TouchableOpacity
                    title="Pause"
                    onPress={async () => await TrackPlayer.pause()}
                    style={styles.button}>
                    <Text>
                      <Icon name="pause" size={30} color={colours.accent} />
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    title="Play"
                    onPress={async () => await TrackPlayer.play()}
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
      ) : null}
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
    marginHorizontal: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default NowPlayingBar;
