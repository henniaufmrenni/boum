import React from 'react';

import NowPlayingBar from '@boum/components/Player/NowPlayingBar';
import {
  AlbumScreen,
  AlbumsScreen,
  ArtistScreen,
  ArtistsScreen,
  GenreScreen,
  GenresScreen,
  LibraryScreen,
  PlaylistScreen,
  PlaylistsScreen,
  QueueScreen,
} from '@boum/screens';
import {NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type LibraryStackProps = {
  navigation: NavigationProp<any>;
  route: any;
};

const LibraryStack = ({navigation, route}: LibraryStackProps) => {
  const LibraryStack = createNativeStackNavigator();

  return (
    <>
      <LibraryStack.Navigator
        screenOptions={{animation: 'none', headerShown: false}}>
        <LibraryStack.Screen name="LibraryLanding" component={LibraryScreen} />
        <LibraryStack.Screen
          name="Album"
          component={AlbumScreen}
          options={({route}) => ({title: route.params.name})}
        />
        <LibraryStack.Screen name="A/>" component={AlbumsScreen} />
        <LibraryStack.Screen name="Artists" component={ArtistsScreen} />
        <LibraryStack.Screen name="Artist" component={ArtistScreen} />
        <LibraryStack.Screen name="Genres" component={GenresScreen} />
        <LibraryStack.Screen name="Genre" component={GenreScreen} />
        <LibraryStack.Screen name="Playlists" component={PlaylistsScreen} />
        <LibraryStack.Screen name="Playlist" component={PlaylistScreen} />
      </LibraryStack.Navigator>
      <NowPlayingBar navigation={navigation} route={route} />
    </>
  );
};

export default LibraryStack;
