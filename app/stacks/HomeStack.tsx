import React from 'react';

import NowPlayingBar from '@boum/components/Player/NowPlayingBar';
import {
  AlbumScreen,
  ArtistScreen,
  HomeScreen,
  ListScreen,
  PlayerScreen,
} from '@boum/screens';

import {NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Session} from '@boum/types';
import {useStore} from '@boum/hooks';

type HomeStackProps = {
  navigation: NavigationProp<any>;
  route: any;
};

const HomeStack = ({navigation, route}: HomeStackProps) => {
  const HomeStack = createNativeStackNavigator();

  return (
    <>
      <HomeStack.Navigator
        screenOptions={{animation: 'none', headerShown: false}}>
        <HomeStack.Screen name="HomeLanding" component={HomeScreen} />
        <HomeStack.Screen name="Album" component={AlbumScreen} />
        <HomeStack.Screen name="Player" component={PlayerScreen} />
        <HomeStack.Screen name="Artist" component={ArtistScreen} />
        <HomeStack.Screen name="List" component={ListScreen} />
      </HomeStack.Navigator>
      <NowPlayingBar navigation={navigation} />
    </>
  );
};

export default HomeStack;
