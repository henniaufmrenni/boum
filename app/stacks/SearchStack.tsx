import React from 'react';
import {NavigationProp} from 'react-navigation';

import NowPlayingBar from '@boum/components/Player/NowPlayingBar';
import {
  AlbumScreen,
  AlbumsScreen,
  ArtistScreen,
  ArtistsScreen,
  GenresScreen,
  SearchScreen,
} from '@boum/screens/';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type SearchStackProps = {
  navigation: NavigationProp<any>;
  route: any;
};

const SearchStack = ({navigation, route}: SearchStackProps) => {
  const SearchStack = createNativeStackNavigator();

  return (
    <>
      <SearchStack.Navigator
        screenOptions={{animation: 'none', headerShown: false}}>
        <SearchStack.Screen name="SearchHome" component={SearchScreen} />
        <SearchStack.Screen name="Album" component={AlbumScreen} />
        <SearchStack.Screen name="Albums" component={AlbumsScreen} />
        <SearchStack.Screen name="Artists" component={ArtistsScreen} />
        <SearchStack.Screen name="Artist" component={ArtistScreen} />
        <SearchStack.Screen name="Genres" component={GenresScreen} />
      </SearchStack.Navigator>
      <NowPlayingBar navigation={navigation} route={route} />
    </>
  );
};

export default SearchStack;
