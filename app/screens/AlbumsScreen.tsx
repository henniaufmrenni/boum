import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {colours} from '@boum/constants';
import {useAlbumsStore, useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {NavigationProp} from '@react-navigation/native';
import {jellyfinClient} from '@boum/lib/api';

type AlbumsScreenProps = {
  navigation: NavigationProp<any>;
};

const AlbumsScreen = ({navigation}: AlbumsScreenProps) => {
  const jellyfin = new jellyfinClient();
  // FIXME: Find a solution for this hack, which is necessary, since zustand can't store JSON.
  const rawSession = useStore(state => state.session);
  let session = {userId: '', accessToken: '', username: '', hostname: ''};
  rawSession !== null ? (session = JSON.parse(rawSession)) : null;

  // Infinite Loading
  const startIndex = useAlbumsStore(state => state.itemsPageIndex);
  const increaseStartIndex = useAlbumsStore(
    state => state.increaseItemsPageIndex,
  );
  const resetAlbumsPageIndex = useAlbumsStore(
    state => state.resetItemsPageIndex,
  );
  const [loadedMore, setLoadedMore] = useState(false);
  const allAlbums = useAlbumsStore(state => state.allItems);
  const setAllAlbums = useAlbumsStore(state => state.setAllItems);

  // Sorting & Filtering
  const sortBy = useAlbumsStore(state => state.sortBy);
  const setSortBy = useAlbumsStore(state => state.setSortBy);
  const sortOrder = useAlbumsStore(state => state.sortOrder);
  const setSortOrder = useAlbumsStore(state => state.setSortOrder);
  const searchTerm = useAlbumsStore(state => state.searchTerm);
  const setSearchTerm = useAlbumsStore(state => state.setSearchTerm);
  const filters = useAlbumsStore(state => state.filters);
  const setFilters = useAlbumsStore(state => state.setFilters);
  const {allAlbumsData, allAlbumsError, allAlbumsLoading, allAlbumsMutate} =
    jellyfin.getAllAlbums(
      session,
      startIndex,
      sortBy,
      sortOrder,
      filters,
      searchTerm,
    );

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

  // Search and filtering modal
  const [modalOpen, setModalOpen] = useState(true);
  const updateSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    mutate();
  };

  useEffect(() => console.log(filters), [filters]);

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
              text={'Albums'}
              sortBy={sortBy}
              setSortBy={setSortBy}
              mutate={mutate}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchTerm={searchTerm}
              setSearchTerm={updateSearchTerm}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              filters={filters}
              setFilters={setFilters}
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

export {AlbumsScreen};
