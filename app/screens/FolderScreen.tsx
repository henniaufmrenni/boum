import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {ListHeader} from '@boum/components/ListItems';
import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {useGetAlbum} from '@boum/hooks/useGetAlbum';
import {Session} from '@boum/types';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import LibraryListItem from '@boum/components/Library/LibraryListItem';

type FolderScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const FolderScreen = ({navigation, route}: FolderScreenProps) => {
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

  const {albumItems, albumInfo, isDownloaded, averageColorRgb} = useGetAlbum(
    item,
    itemId,
    session,
  );

  return (
    <>
      <View style={styles.container}>
        {albumItems && albumInfo ? (
          <FlatList
            data={albumItems.Items}
            keyExtractor={trackInfo => trackInfo.Id}
            ListHeaderComponent={
              <ListHeader
                albumItems={albumItems}
                item={albumInfo}
                session={session}
                averageColorRgb={averageColorRgb}
                mutate={() => {
                  return;
                }}
                mediaType={'Folder'}
                screenMode={'ListView'}
                navigation={navigation}
                isDownloaded={isDownloaded}
              />
            }
            renderItem={({item}) => {
              return (
                <LibraryListItem
                  item={item}
                  navigation={navigation}
                  session={session}
                  navigationDestination={
                    item.Type === 'MusicAlbum'
                      ? 'Album'
                      : item.Type === 'MusicArtist'
                      ? 'Artist'
                      : item.Type === 'Folder'
                      ? 'Folder'
                      : item.Type === 'Book'
                      ? 'Book'
                      : ''
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

export {FolderScreen};
