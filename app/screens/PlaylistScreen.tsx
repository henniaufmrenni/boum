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
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {State, usePlaybackState} from 'react-native-track-player';
import {MediaItem} from '@boum/types';

type PlaylistScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {item: MediaItem; itemId: string}}>;
};

const PlaylistScreen: React.FC<PlaylistScreenProps> = ({route, navigation}) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  const [averageColorRgb, setAverageColorRgb] =
    useState<string>('rgb(168, 44, 69)');
  const {itemId, item} = route.params;

  const {albumItems, albumItemsMutate} = jellyfin.getAlbumItems(
    session,
    itemId,
  );
  const {similarAlbums} = jellyfin.getSimilarItems(session, itemId);
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
    }
  }, [item.ImageBlurHashes.Primary]);

  const bitrateLimit = useBitrateLimit();
  const isDownloaded = useCheckParentIsDownloaded(item.Id);

  const mutate = () => {
    albumItemsMutate();
  };

  const playerState = usePlaybackState();
  const isPlaying = playerState === State.Playing;

  return (
    <>
      <View style={styles.container}>
        {albumItems !== undefined && item !== undefined ? (
          <FlatList
            data={albumItems.Items}
            keyExtractor={listItem => listItem.Id}
            ListHeaderComponent={
              <ListHeader
                albumItems={albumItems}
                item={item}
                session={session}
                averageColorRgb={averageColorRgb}
                mutate={mutate}
                mediaType={'Album'}
                screenMode={'ListView'}
                navigation={navigation}
                bitrateLimit={bitrateLimit}
                isDownloaded={isDownloaded}
                isPlaying={isPlaying}
              />
            }
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
