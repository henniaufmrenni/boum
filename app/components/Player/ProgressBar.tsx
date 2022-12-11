import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colours} from '@boum/constants';

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({progress}: ProgressBarProps) => {
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
