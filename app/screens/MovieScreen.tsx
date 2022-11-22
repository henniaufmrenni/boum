import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, ScrollView} from 'react-native';

import {AlbumFooter} from '@boum/components/Album';
import {ListHeader, ListRenderItem} from '@boum/components/ListItems';
import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {useBitrateLimit, useStore} from '@boum/hooks';
import {useGetAlbum} from '@boum/hooks/useGetAlbum';
import {Session} from '@boum/types';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {State, usePlaybackState} from 'react-native-track-player';
import {VideoHeader} from '@boum/components/Video';
import {jellyfinClient} from '@boum/lib/api';
import {Blurhash} from 'react-native-blurhash';

type MovieScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const MovieScreen = ({navigation, route}: MovieScreenProps) => {
  const jellyfin = new jellyfinClient();
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
  const [averageColorRgb, setAverageColorRgb] =
    useState<string>('rgb(168, 44, 69)');

  const {data, error} = jellyfin.getSingleItemSwr(session, item.Id);
  const {similarAlbums} = jellyfin.getSimilarItems(session, item.Id);

  useEffect(() => {
    function setBackGround() {
      if (data) {
        if (data.ImageBlurHashes.Primary !== undefined) {
          const averageColor = Blurhash.getAverageColor(
            data.ImageBlurHashes.Primary[
              Object.keys(data.ImageBlurHashes.Primary)[0]
            ],
          );
          setAverageColorRgb(
            `rgb(${averageColor?.r}, ${averageColor?.g}, ${averageColor?.b} )`,
          );
        }
      }
    }
    setBackGround();
  }, [data]);

  return (
    <>
      <ScrollView style={styles.container}>
        {data && !error && similarAlbums !== undefined ? (
          <>
            <VideoHeader
              item={data}
              session={session}
              navigation={navigation}
              similarItems={similarAlbums}
              averageColorRgb={averageColorRgb}
            />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
  },
});

export {MovieScreen};
