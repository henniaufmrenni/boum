import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import ArtistHeader from '@boum/components/Artist/ArtistHeader';
import {ArtistItems} from '@boum/components/Artist';
import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {useGetArtist, useStore} from '@boum/hooks';
import {NavigationProp, RouteProp} from '@react-navigation/native';

type ArtistScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const ArtistScreen = ({navigation, route}: ArtistScreenProps) => {
  const {itemId, item} = route.params;

  const rawSession = useStore(state => state.session);
  let session: Session = {
    userId: '',
    accessToken: '',
    username: '',
    hostname: '',
    maxBitrateMobile: 140000000,
    maxBitrateWifi: 140000000,
    deviceId: '',
  };
  rawSession !== null ? (session = JSON.parse(rawSession)) : null;

  const {
    artistInfo,
    artistItems,
    similarArtists,
    appearsOnItems,
    averageColorRgb,
  } = useGetArtist(item, itemId, session);

  return (
    <ScrollView style={styles.container}>
      {artistInfo && artistItems && appearsOnItems && averageColorRgb ? (
        <>
          {/*
         Convert this to a Flatlist
         https://reactnative.dev/docs/optimizing-flatlist-configuration#use-getitemlayout
        */}
          <ArtistHeader
            item={artistInfo}
            artistItems={artistItems}
            session={session}
            averageColorRgb={averageColorRgb}
            navigation={navigation}
          />
          <ArtistItems
            screenItem={artistInfo}
            items={artistItems}
            navigation={navigation}
            session={session}
            navigationDestination={'Album'}
            text={'Albums'}
          />
          <ArtistItems
            screenItem={artistInfo}
            items={appearsOnItems}
            session={session}
            navigation={navigation}
            navigationDestination={'Album'}
            text={'Appears on'}
          />
          <ArtistItems
            screenItem={artistInfo}
            items={similarArtists}
            session={session}
            navigation={navigation}
            navigationDestination={'Artist'}
            text={'Similar Artists'}
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
  },
});

export {ArtistScreen};
