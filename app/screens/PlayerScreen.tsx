import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import PlayerAlbumImage from '@boum/components/Player/PlayerImage';
import SingleItemHeader from '@boum/components/SingleItemHeader';
import {colours} from '@boum/constants';
import {useStore, useToggleRepeatMode} from '@boum/hooks';
import {getMinSec} from '@boum/lib/helper/helper';
import {NavigationProp} from '@react-navigation/native';
import {Slider} from '@sharcoux/slider';

const width = Dimensions.get('window').width;

type PlayerScreenProps = {
  navigation: NavigationProp<any>;
};

const PlayerScreen = ({navigation}: PlayerScreenProps) => {
  const [overlayHidden, setOverlayHidden] = useState(true);

  const {position, duration} = useProgress();
  const playerState = usePlaybackState();

  const repeatMode = useStore(state => state.repeatMode);

  const track = useStore(state => state.currentTrack);
  const queue = useStore(state => state.queue);
  const rawSession = useStore(state => state.session);
  let session = {userId: '', accessToken: '', username: '', hostname: ''};
  rawSession !== null ? (session = JSON.parse(rawSession)) : null;

  const currentTrack = queue[track];
  const sleepTimer = useStore(state => state.sleepTimer);
  const playbackSpeed = useStore(state => state.playbackSpeed);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colours.grey['700'], colours.black]}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0.5, y: 0.65}}>
        <SingleItemHeader
          mediaItem={currentTrack}
          mediaType={'Song'}
          screenMode={'PlayerView'}
          navigation={navigation}
          contextAction={() => setOverlayHidden(!overlayHidden)}
          session={session}
        />
        {queue && currentTrack ? (
          <PlayerAlbumImage track={currentTrack} />
        ) : (
          <Text>Error Image</Text>
        )}
        <View style={styles.controlsAndInfoContainer}>
          {currentTrack ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Album', {
                    itemId: currentTrack.albumId,
                    itemName: currentTrack.albumId,
                    item: undefined,
                  })
                }>
                <Text
                  style={styles.albumTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {currentTrack.album}
                </Text>
                <Text
                  style={styles.trackTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {currentTrack.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Artist', {
                    itemId: currentTrack.artistId,
                    itemName: currentTrack.artist,
                    item: undefined,
                  })
                }>
                <Text style={styles.artistTitle}>{currentTrack.artist}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.albumTitle}>Not Playing</Text>
          )}
          <View style={styles.playerControlsContainer}>
            <>
              {track >= 1 ? (
                <TouchableOpacity
                  title="Previous"
                  onPress={async () =>
                    await TrackPlayer.skipToPrevious().catch(() =>
                      console.log('No previous track'),
                    )
                  }
                  style={styles.button}>
                  <Text>
                    <Icon
                      name="play-skip-back"
                      size={45}
                      color={colours.accent}
                    />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.button}>
                  <Icon
                    name="play-skip-back"
                    size={45}
                    color={colours.grey['700']}
                  />
                </Text>
              )}
            </>
            {playerState === State.Playing ? (
              <TouchableOpacity
                title="Pause"
                onPress={async () => await TrackPlayer.pause()}
                style={styles.playButton}>
                <Text>
                  <Icon name="pause-circle" size={90} color={colours.accent} />
                </Text>
              </TouchableOpacity>
            ) : playerState === State.Buffering ||
              playerState === State.Connecting ? (
              <View title="Play" style={styles.playButton}>
                <Text>
                  <Icon
                    name="play-circle"
                    size={90}
                    color={colours.grey['600']}
                  />
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                title="Play"
                onPress={async () => await TrackPlayer.play()}
                style={styles.playButton}>
                <Text>
                  <Icon name="play-circle" size={90} color={colours.accent} />
                </Text>
              </TouchableOpacity>
            )}
            {repeatMode === RepeatMode.Queue || queue.length !== track + 1 ? (
              <TouchableOpacity
                title="Next"
                onPress={async () =>
                  await TrackPlayer.skipToNext().catch(() =>
                    console.log('No next track'),
                  )
                }
                style={styles.button}>
                <Text>
                  <Icon
                    name="play-skip-forward"
                    size={45}
                    color={colours.accent}
                  />
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.button}>
                <Icon
                  name="play-skip-forward"
                  size={45}
                  color={colours.grey['700']}
                />
              </Text>
            )}
          </View>
          {position && duration ? (
            <View style={styles.sliderAndPositionContainer}>
              <Text style={styles.textSlider}>{getMinSec(position)}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  value={position / duration}
                  minimumTrackTintColor={colours.accent}
                  thumbTintColor={colours.accent}
                  maximumTrackTintColor={'#222'}
                  trackHeight={3}
                  onSlidingComplete={async (value: number) =>
                    await TrackPlayer.seekTo(duration * value).catch(err =>
                      console.warn(err),
                    )
                  }
                />
              </View>
              <Text style={styles.textSlider}>{getMinSec(duration)}</Text>
            </View>
          ) : (
            <View style={styles.sliderAndPositionContainer}>
              <Text style={styles.textSlider}>0:00</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  value={0.01}
                  minimumTrackTintColor={colours.accent}
                  maximumTrackTintColor={'#222'}
                  trackHeight={3}
                  onSlidingComplete={(value: number) => console.log(value)}
                />
              </View>
              <Text style={styles.textSlider}>0:00</Text>
            </View>
          )}
          <>
            {currentTrack.url.slice(0, 7) === 'file://' ? (
              <Text style={styles.textSource}>Local Playback</Text>
            ) : currentTrack.url.includes('stream.aac') ? (
              <Text style={styles.textSource}>Streaming Transcoded</Text>
            ) : (
              <Text style={styles.textSource}>Streaming Direct</Text>
            )}
          </>
          <View style={styles.playerMetaControlsContainer}>
            <TouchableOpacity
              onPress={async () => await TrackPlayer.skipToNext()}
              style={styles.button}>
              <Text>
                <Icon name="heart-outline" size={30} color={colours.accent} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Queue', {});
              }}
              style={styles.button}>
              <Text>
                <Icon name="list-outline" size={30} color={colours.accent} />
              </Text>
            </TouchableOpacity>
            {repeatMode === RepeatMode.Track ? (
              <TouchableOpacity
                onPress={() =>
                  useToggleRepeatMode(repeatMode).then(mode =>
                    useStore.setState({repeatMode: mode}),
                  )
                }
                style={styles.button}>
                <Text>
                  <MCIcon name="repeat-once" size={30} color={colours.accent} />
                </Text>
              </TouchableOpacity>
            ) : repeatMode === RepeatMode.Queue ? (
              <TouchableOpacity
                title="Repeat queue"
                onPress={() =>
                  useToggleRepeatMode(repeatMode).then(mode =>
                    useStore.setState({repeatMode: mode}),
                  )
                }
                style={styles.button}>
                <Text>
                  <MCIcon name="repeat" size={30} color={colours.accent} />
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                title="Repeat off"
                onPress={() =>
                  useToggleRepeatMode(repeatMode).then(mode =>
                    useStore.setState({repeatMode: mode}),
                  )
                }
                style={styles.button}>
                <Text>
                  <MCIcon name="repeat-off" size={30} color={colours.accent} />
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.textSource}>
            {sleepTimer && sleepTimer !== 0 ? (
              <>
                <Icon name={'moon'} size={18} color={colours.white} />
                {'   '}
                {/* eslint-disable-next-line no-bitwise */}
                {~~((sleepTimer - Date.now()) / 60000)} min
              </>
            ) : null}
            {sleepTimer && sleepTimer !== 0 && playbackSpeed !== 1 ? (
              <>{'       '}</>
            ) : null}
            {playbackSpeed !== 1 ? (
              <>
                <Icon name={'speedometer'} size={18} color={colours.white} />
                {'   '}
                {playbackSpeed}
              </>
            ) : null}
          </Text>
        </View>
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
  slider: {},
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
});

export {PlayerScreen};
