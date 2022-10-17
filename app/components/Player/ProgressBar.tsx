import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useProgress} from 'react-native-track-player';

import {colours} from '@boum/constants';

const ProgressBar: React.FC = () => {
  const {position, duration} = useProgress();

  let progress = 0;
  if (duration > 0) {
    progress = position / duration;
  }

  return (
    <View style={progressStyles.container}>
      <View style={[progressStyles.left, {flex: progress}]} />
      <View style={[progressStyles.right, {flex: 1 - progress}]} />
    </View>
  );
};

const progressStyles = StyleSheet.create({
  container: {
    height: 2,
    flexDirection: 'row',
  },
  left: {
    backgroundColor: colours.accent,
  },
  right: {
    backgroundColor: colours.grey['100'],
  },
});

export default ProgressBar;
