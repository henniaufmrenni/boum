import React from 'react';

import NowPlayingBar from '@boum/components/Player/NowPlayingBar';
import {
  AlbumScreen,
  AlbumsScreen,
  ArtistScreen,
  ArtistsScreen,
  BooksScreen,
  GenreScreen,
  GenresScreen,
  LibraryScreen,
  MovieScreen,
  MoviesScreen,
  PlaylistScreen,
  PlaylistsScreen,
  TracksScreen,
} from '@boum/screens';
import {NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FolderScreen} from '@boum/screens/FolderScreen';

type LibraryStackProps = {
  navigation: NavigationProp<any>;
};

const LibraryStack: React.FC<LibraryStackProps> = ({navigation}) => {
  const LibraryStack = createNativeStackNavigator();

  return (
    <>
      <LibraryStack.Navigator
        screenOptions={{animation: 'none', headerShown: false}}>
        <LibraryStack.Screen name="LibraryLanding" component={LibraryScreen} />
        <LibraryStack.Screen name="Album" component={AlbumScreen} />
        <LibraryStack.Screen name="Albums" component={AlbumsScreen} />
        <LibraryStack.Screen name="Artist" component={ArtistScreen} />
        <LibraryStack.Screen name="Artists" component={ArtistsScreen} />
        <LibraryStack.Screen name="Books" component={BooksScreen} />
        <LibraryStack.Screen name="Folder" component={FolderScreen} />
        <LibraryStack.Screen name="Genre" component={GenreScreen} />
        <LibraryStack.Screen name="Genres" component={GenresScreen} />
        <LibraryStack.Screen name="Movie" component={MovieScreen} />
        <LibraryStack.Screen name="Movies" component={MoviesScreen} />
        <LibraryStack.Screen name="Playlist" component={PlaylistScreen} />
        <LibraryStack.Screen name="Playlists" component={PlaylistsScreen} />
        <LibraryStack.Screen name="Tracks" component={TracksScreen} />
      </LibraryStack.Navigator>
      <NowPlayingBar navigation={navigation} />
    </>
  );
};

export default LibraryStack;
