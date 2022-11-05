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
  PlaylistScreen,
  PlaylistsScreen,
} from '@boum/screens';
import {NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FolderScreen} from '@boum/screens/FolderScreen';

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
        <LibraryStack.Screen name="Album/>" component={AlbumScreen} />
        <LibraryStack.Screen name="Albums" component={AlbumsScreen} />
        <LibraryStack.Screen name="Audiobooks" component={BooksScreen} />
        <LibraryStack.Screen name="Artist" component={ArtistScreen} />
        <LibraryStack.Screen name="Artists" component={ArtistsScreen} />
        <LibraryStack.Screen name="Folder" component={FolderScreen} />
        <LibraryStack.Screen name="Genre" component={GenreScreen} />
        <LibraryStack.Screen name="Genres" component={GenresScreen} />
        <LibraryStack.Screen name="Playlist" component={PlaylistScreen} />
        <LibraryStack.Screen name="Playlists" component={PlaylistsScreen} />
      </LibraryStack.Navigator>
      <NowPlayingBar navigation={navigation} route={route} />
    </>
  );
};

export default LibraryStack;
