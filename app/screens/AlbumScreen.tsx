import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {State, usePlaybackState} from 'react-native-track-player';
import {useMediaStatus} from 'react-native-google-cast';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {AlbumFooter} from '@boum/components/Album';
import {ListHeader, ListRenderItem} from '@boum/components/ListItems';
import {LoadingSpinner} from '@boum/components/Generic';
import {useBitrateLimit, useStore, useGetAlbum} from '@boum/hooks';
import {colours} from '@boum/constants';
import {MediaItem} from '@boum/types';

type AlbumScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {item: MediaItem; itemId: string}}>;
};

const AlbumScreen: React.FC<AlbumScreenProps> = ({navigation, route}) => {
  const {itemId, item} = route.params;

  const session = useStore(state => state.session);

  const {albumItems, similarAlbums, albumInfo, isDownloaded, averageColorRgb} =
    useGetAlbum(item, itemId, session);

  const bitrateLimit = useBitrateLimit();

  const track = useStore(state => state.currentTrack);
  const queue = useStore(state => state.queue);
  const selectedStorageLocation = useStore(
    state => state.selectedStorageLocation,
  );

  const currentTrack = queue[track];

  const playerState = usePlaybackState();
  const isPlaying = playerState === State.Playing;

  const castService = useStore(state => state.castService);
  const castClient = useStore(state => state.castClient);
  const mediaStatus = useMediaStatus();

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
                castClient={castClient}
                bitrateLimit={bitrateLimit}
                isDownloaded={isDownloaded}
                itemIsPlaying={
                  currentTrack && currentTrack.albumId === albumInfo.Id
                    ? true
                    : false
                }
                isPlaying={isPlaying}
                selectedStorageLocation={selectedStorageLocation}
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
                  castService={castService}
                  castClient={castClient}
                  isPlaying={
                    mediaStatus?.currentQueueItem?.mediaInfo.contentId ===
                      item.Id ||
                    (!mediaStatus &&
                      currentTrack &&
                      currentTrack.id === item.Id)
                      ? true
                      : false
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
