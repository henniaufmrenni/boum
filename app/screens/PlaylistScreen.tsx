import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Blurhash} from 'react-native-blurhash';

import {AlbumFooter} from '@boum/components/Album';
import {LoadingSpinner} from '@boum/components/Generic';
import {ListHeader, ListRenderItem} from '@boum/components/ListItems';
import {colours} from '@boum/constants';
import {
  useBitrateLimit,
  useCheckParentIsDownloaded,
  useStore,
} from '@boum/hooks';
import {jellyfinClient} from '@boum/lib/api';
import {Session} from '@boum/types';
import {NavigationProp, RouteProp} from '@react-navigation/native';

type PlaylistScreenProps = {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
};

const PlaylistScreen = ({route, navigation}: PlaylistScreenProps) => {
  const jellyfin = new jellyfinClient();

  const [averageColorRgb, setAverageColorRgb] = useState(false);
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

  const {albumItems, albumItemsMutate} = jellyfin.getAlbumItems(
    session,
    itemId,
  );
  const {similarAlbums} = jellyfin.getSimilarAlbums(session, itemId);
  useEffect(() => {
    async function setBackGround() {
      const averageColor = Blurhash.getAverageColor(
        item.ImageBlurHashes.Primary[
          Object.keys(item.ImageBlurHashes.Primary)[0]
        ],
      );
      setAverageColorRgb(
        `rgb(${averageColor?.r}, ${averageColor?.g}, ${averageColor?.b} )`,
      );
    }
    if (item.ImageBlurHashes.Primary !== undefined) {
      setBackGround();
    } else {
      setAverageColorRgb('rgb(168, 44, 69)');
    }
  }, [item.ImageBlurHashes.Primary]);

  const bitrateLimit = useBitrateLimit();
  const isDownloaded = useCheckParentIsDownloaded(item.Id);

  const mutate = () => {
    albumItemsMutate();
  };

  return (
    <>
      <View style={styles.container}>
        {albumItems !== undefined && item !== undefined ? (
          <FlatList
            data={albumItems.Items}
            keyExtractor={listItem => listItem.Id}
            ListHeaderComponent={ListHeader({
              albumItems,
              item,
              session,
              averageColorRgb,
              mutate,
              navigation,
              bitrateLimit,
              isDownloaded,
            })}
            ListFooterComponent={
              <AlbumFooter
                albumItems={albumItems}
                session={session}
                item={item}
                similarAlbums={similarAlbums}
                navigation={navigation}
              />
            }
            renderItem={({item, index}) => {
              return (
                <ListRenderItem
                  item={item}
                  index={index}
                  albumItems={albumItems}
                  session={session}
                  bitrateLimit={bitrateLimit}
                />
              );
            }}
          />
        ) : (
          <LoadingSpinner />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
  },
});

export {PlaylistScreen};
