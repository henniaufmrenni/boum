import React from 'react';
import {
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {RepeatMode} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import {colours} from '@boum/constants';
import {getMinSec} from '@boum/lib/helper';

import {Slider} from '@sharcoux/slider';
import TextTicker from '@boum/components/External/TextTicker';

const width = Dimensions.get('window').width;

type PlayerControlsProps = {
  trackTitle: string;
  albumTitle: string;
  artistTitle: string;
  trackUrl?: string;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  castDevice: string | undefined;
  queuePosition: number | undefined;
  queueLength: number | undefined;
  repeatMode?: RepeatMode;
  albumNavigation: () => void;
  artistNavigation: () => void;
  skipToPreviousTrack: () => void;
  playTrack: () => void;
  pauseTrack: () => void;
  skipToNextTrack: () => void;
  seekTo: (number: number) => void;
  setRepeatMode: () => void;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
  trackTitle,
  albumTitle,
  artistTitle,
  trackUrl,
  isPlaying,
  isLoading,
  position,
  duration,
  castDevice,
  queuePosition,
  queueLength,
  repeatMode,
  albumNavigation,
  artistNavigation,
  skipToPreviousTrack,
  playTrack,
  pauseTrack,
  skipToNextTrack,
  seekTo,
  setRepeatMode,
}) => {
  return (
    <View style={styles.controlsAndInfoContainer}>
      {trackTitle ? (
        <>
          <TouchableOpacity onPress={albumNavigation}>
            <Text
              style={styles.albumTitle}
              numberOfLines={1}
              ellipsizeMode="tail">
              {albumTitle}
            </Text>
            <View style={styles.trackTitleContainer}>
              <TextTicker
                style={styles.trackTitle}
                duration={18000}
                loop={true}
                bounce={true}
                repeatSpacer={100}
                easing={Easing.bezier(0.37, 0, 0.63, 1)}
                marqueeDelay={0}>
                {trackTitle}
              </TextTicker>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={artistNavigation}>
            <Text style={styles.artistTitle}>{artistTitle}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.albumTitle}>Not Playing</Text>
      )}
      <View style={styles.playerControlsContainer}>
        <>
          {queuePosition >= 1 ? (
            <TouchableOpacity
              onPress={skipToPreviousTrack}
              style={styles.button}>
              <Text>
                <Icon name="play-skip-back" size={45} color={colours.accent} />
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
        {isPlaying ? (
          <TouchableOpacity onPress={pauseTrack} style={styles.playButton}>
            <Text>
              <Icon name="pause-circle" size={90} color={colours.accent} />
            </Text>
          </TouchableOpacity>
        ) : isLoading ? (
          <View style={styles.playButton}>
            <Text>
              <Icon name="play-circle" size={90} color={colours.grey['600']} />
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={playTrack} style={styles.playButton}>
            <Text>
              <Icon name="play-circle" size={90} color={colours.accent} />
            </Text>
          </TouchableOpacity>
        )}
        {repeatMode === RepeatMode.Queue ||
        queuelength !== queuePosition + 1 ? (
          <TouchableOpacity onPress={skipToNextTrack} style={styles.button}>
            <Text>
              <Icon name="play-skip-forward" size={45} color={colours.accent} />
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
              enabled={true}
              maximumTrackTintColor={'#222'}
              trackHeight={3}
              onSlidingComplete={(value: number) => {
                seekTo(~~(value * duration));
              }}
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
              enabled={false}
              minimumTrackTintColor={colours.accent}
              maximumTrackTintColor={'#222'}
              trackHeight={3}
            />
          </View>
          <Text style={styles.textSlider}>0:00</Text>
        </View>
      )}
      <>
        {castDevice !== undefined ? (
          <Text style={styles.textSource}>Casting to {castDevice}</Text>
        ) : trackUrl?.slice(0, 7) === 'file://' ? (
          <Text style={styles.textSource}>Local Playback</Text>
        ) : trackUrl?.includes('&static=false') ? (
          <Text style={styles.textSource}>Streaming Transcoded</Text>
        ) : (
          <Text style={styles.textSource}>Streaming Direct</Text>
        )}
      </>
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
  trackTitleContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
});

export {PlayerControls};
