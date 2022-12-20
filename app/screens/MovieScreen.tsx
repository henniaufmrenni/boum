import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Blurhash} from 'react-native-blurhash';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {LoadingSpinner} from '@boum/components/Generic';
import {VideoHeader} from '@boum/components/Video';
import {useStore} from '@boum/hooks';
import {colours} from '@boum/constants';
import {MediaItem} from '@boum/types';

type MovieScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {item: MediaItem}}>;
};

const MovieScreen: React.FC<MovieScreenProps> = ({navigation, route}) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const {item} = route.params;

  const session = useStore(state => state.session);

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
