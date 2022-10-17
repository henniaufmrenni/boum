import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {colours} from '@boum/constants';

class LoadingSpinner extends React.PureComponent {
  render() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={colours.accent} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinnerContainer: {
    backgroundColor: colours.black,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default LoadingSpinner;
