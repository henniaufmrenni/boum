import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colours, sizes} from '@boum/constants';
import {NavigationProp} from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type LibraryScreenProps = {
  navigation: NavigationProp<any>;
};

const LibraryScreen = ({navigation}: LibraryScreenProps) => {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Tracks')}
          style={styles.textContainer}>
          <Ionicon
            name={'ios-musical-notes'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Albums')}
          style={styles.textContainer}>
          <Ionicon
            name={'albums'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Artists')}
          style={styles.textContainer}>
          <FontAwesome5
            name={'microphone-alt'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Genres')}
          style={styles.textContainer}>
          <FontAwesome5
            name={'guitar'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Genres</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Playlists')}
          style={styles.textContainer}>
          <Ionicon
            name={'list'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Books')}
          style={styles.textContainer}>
          <Ionicon
            name={'book-sharp'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Movies')}
          style={styles.textContainer}>
          <Ionicon
            name={'film-outline'}
            size={25}
            color={'white'}
            style={styles.icon}
          />
          <Text style={styles.text}>Movies</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  textContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 36,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
  icon: {
    width: '15%',
  },
});

export {LibraryScreen};
