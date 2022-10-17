import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import NavigationText from '@boum/components/Library/NavigationText';
import {colours, sizes} from '@boum/constants';

import {NavigationProp} from '@react-navigation/native';

type LibraryScreenProps = {
  navigation: NavigationProp<any>;
};

const LibraryScreen = ({navigation}: LibraryScreenProps) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.container}>
        <NavigationText
          text="Albums"
          navigation={navigation}
          navigationDestination={'Albums'}
        />
        <NavigationText
          text="Artists"
          navigation={navigation}
          navigationDestination={'Artists'}
        />
        <NavigationText
          text="Genres"
          navigation={navigation}
          navigationDestination={'Genres'}
        />
        <NavigationText
          text="Playlists"
          navigation={navigation}
          navigationDestination={'Playlists'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colours.black,
    height: '100%',
    width: '100%',
  },
  container: {
    width: '100%',
    flex: 2,
    color: 'white',
    paddingLeft: sizes.marginListX,
    paddingRight: sizes.marginListX,
  },
  title: {
    marginTop: 30,
    paddingBottom: 12,
    paddingLeft: sizes.marginListX,
    paddingRight: sizes.marginListX,
    fontSize: 40,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
  error: {
    textAlign: 'center',
  },
});

export {LibraryScreen};
