import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {colours} from '@boum/constants';
import {useMoviesStore, useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {NavigationProp} from '@react-navigation/native';

type MoviesScreenProps = {
  navigation: NavigationProp<any>;
};

const MoviesScreen: React.FC<MoviesScreenProps> = ({navigation}) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  // Infinite Loading
  const startIndex = useMoviesStore(state => state.itemsPageIndex);
  const increaseStartIndex = useMoviesStore(
    state => state.increaseItemsPageIndex,
  );
  const resetAlbumsPageIndex = useMoviesStore(
    state => state.resetItemsPageIndex,
  );
  const [loadedMore, setLoadedMore] = useState(false);
  const allAlbums = useMoviesStore(state => state.allItems);
  const setAllAlbums = useMoviesStore(state => state.setAllItems);

  // Sorting & Filtering
  const sortBy = useMoviesStore(state => state.sortBy);
  const setSortBy = useMoviesStore(state => state.setSortBy);
  const sortOrder = useMoviesStore(state => state.sortOrder);
  const setSortOrder = useMoviesStore(state => state.setSortOrder);
  const searchTerm = useMoviesStore(state => state.searchTerm);
  const setSearchTerm = useMoviesStore(state => state.setSearchTerm);
  const filters = useMoviesStore(state => state.filters);
  const setFilters = useMoviesStore(state => state.setFilters);
  const {allAlbumsData, allAlbumsError, allAlbumsLoading, allAlbumsMutate} =
    jellyfin.getAllAlbums(
      session,
      startIndex,
      sortBy,
      sortOrder,
      filters,
      searchTerm,
      '',
      'Movie',
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
              text={'Movies'}
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
              navigationDestination={'Movie'}
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

export {MoviesScreen};
