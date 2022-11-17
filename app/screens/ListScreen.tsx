import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {jellyfinClient} from '@boum/lib/api';

type ListScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const ListScreen = ({navigation, route}: ListScreenProps) => {
  const {sortBy, sortOrder, filters, listTitle} = route.params;

  const jellyfin = new jellyfinClient();
  // FIXME: Find a solution for this hack, which is necessary, since zustand can't store JSON.
  const rawSession = useStore(state => state.session);
  let session = {userId: '', accessToken: '', username: '', hostname: ''};
  rawSession !== null ? (session = JSON.parse(rawSession)) : null;

  // Infinite Loading
  const [startIndex, setStartIndex] = useState<number>(0);

  const increaseStartIndex = () => setStartIndex(startIndex + 40);
  const resetAlbumsPageIndex = () => setStartIndex(0);

  const [loadedMore, setLoadedMore] = useState(false);
  const [allAlbums, setAllAlbums] = useState<false | Array<Object>>(false);

  const {allAlbumsData, allAlbumsError, allAlbumsLoading, allAlbumsMutate} =
    jellyfin.getAllAlbums(session, startIndex, sortBy, sortOrder, filters, '');

  if (!allAlbumsLoading && !loadedMore && !allAlbumsError) {
    const newAlbumItems = addNewItemsToOldObject(
      startIndex,
      allAlbums,
      allAlbumsData,
    );
    setAllAlbums(newAlbumItems);
    setLoadedMore(true);
  }

  const mutate = () => {
    setRefreshing(true);
    resetAlbumsPageIndex();
    setAllAlbums(false);
    allAlbumsMutate();
    setLoadedMore(false);
    setRefreshing(false);
  };

  // Pullup to refresh
  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={allAlbums.Items}
          keyExtractor={item => item.Id}
          onRefresh={() => mutate()}
          horizontal={false}
          refreshing={refreshing}
          ListHeaderComponent={
            <LibraryHeader
              text={listTitle}
              modalOpen={false}
              disableFiltering={true}
            />
          }
          renderItem={({item}) => (
            <LibraryListItem
              item={item}
              navigation={navigation}
              session={session}
              navigationDestination={'Album'}
            />
          )}
          onEndReached={() => {
            if (
              startIndex < allAlbums.TotalRecordCount &&
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

export {ListScreen};
