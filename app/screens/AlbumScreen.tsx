import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {AlbumFooter} from '@boum/components/Album';
import {ListHeader, ListRenderItem} from '@boum/components/ListItems';
import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {useBitrateLimit, useStore} from '@boum/hooks';
import {useGetAlbum} from '@boum/hooks/useGetAlbum';
import {Session} from '@boum/types';
import {NavigationProp, RouteProp} from '@react-navigation/native';

type AlbumScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const AlbumScreen = ({navigation, route}: AlbumScreenProps) => {
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

  const {albumItems, similarAlbums, albumInfo, isDownloaded, averageColorRgb} =
    useGetAlbum(item, itemId, session);

  const bitrateLimit = useBitrateLimit();

  const track = useStore(state => state.currentTrack);
  const queue = useStore(state => state.queue);

  const currentTrack = queue[track];

  return (
    <>
      <View style={styles.container}>
        {albumItems && albumInfo ? (
          <FlatList
            data={albumItems.Items}
            keyExtractor={trackInfo => trackInfo.Id}
            extraData={currentTrack}
            ListHeaderComponent={
              <ListHeader
                albumItems={albumItems}
                item={albumInfo}
                session={session}
                averageColorRgb={averageColorRgb}
                mutate={() => {
                  return;
                }}
                mediaType={'Album'}
                screenMode={'ListView'}
                navigation={navigation}
                bitrateLimit={bitrateLimit}
                isDownloaded={isDownloaded}
                isPlaying={
                  currentTrack && currentTrack.albumId === albumInfo.Id
                    ? true
                    : false
                }
              />
            }
            ListFooterComponent={
              <AlbumFooter
                albumItems={albumItems}
                session={session}
                item={albumInfo}
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
                  isPlaying={
                    currentTrack && currentTrack.id === item.Id ? true : false
                  }
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

export {AlbumScreen};
