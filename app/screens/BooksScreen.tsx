import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {colours} from '@boum/constants';
import {useBooksStore, useGetBooks, useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';
import {Session} from '@boum/types';

type BooksScreenProps = {
  navigation: NavigationProp<any>;
};

const BooksScreen = ({navigation}: BooksScreenProps) => {
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

  const {allAudiobooks, setLoadedMore} = useGetBooks(session);

  // Infinite Loading
  const startIndex = useBooksStore(state => state.itemsPageIndex);
  const increaseStartIndex = useBooksStore(
    state => state.increaseItemsPageIndex,
  );

  // Sorting & Filtering
  const sortBy = useBooksStore(state => state.sortBy);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={allAudiobooks.Items}
          keyExtractor={item => item.Id}
          horizontal={false}
          ListHeaderComponent={
            <LibraryHeader text={'Books'} disableFiltering={true} />
          }
          renderItem={({item}) => (
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
          )}
          onEndReached={() => {
            if (
              startIndex < allAudiobooks.TotalRecordCount &&
              sortBy !== 'Random'
            ) {
              increaseStartIndex();
              setLoadedMore(false);
            }
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'rgb(59,108,212)',
    fontSize: 42,
    fontWeight: '100',
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
  },
});

export {BooksScreen};
