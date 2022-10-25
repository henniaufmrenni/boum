import React from 'react';
import {StyleSheet, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';

import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {Picker} from '@react-native-picker/picker';

const PlaybackSpeedPicker = () => {
  const setPlaybackSpeedState = useStore(state => state.setPlaybackSpeed);

  return (
    <View style={styles.container}>
      <Picker
        onValueChange={async (itemValue: number) =>
          await TrackPlayer.setRate(itemValue).then(() =>
            setPlaybackSpeedState(itemValue),
          )
        }
        enabled={true}
        itemStyle={styles.picker}>
        <Picker.Item label="--- Set Playback Speed ---" style={styles.item} />
        <Picker.Item label="0.5" value={0.5} style={styles.item} />
        <Picker.Item label="0.75" value={0.75} style={styles.item} />
        <Picker.Item label="Normal" value={1} style={styles.item} />
        <Picker.Item label="1.25" value={1.25} style={styles.item} />
        <Picker.Item label="1.5" value={1.5} style={styles.item} />
        <Picker.Item label="1.75" value={1.75} style={styles.item} />
        <Picker.Item label="2" value={2} style={styles.item} />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: 'white',
  },
  text: {
    color: colours.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  picker: {
    color: colours.white,
    width: '100%',
  },
  item: {
    color: colours.black,
    backgroundColor: colours.white,
  },
});

export {PlaybackSpeedPicker};
