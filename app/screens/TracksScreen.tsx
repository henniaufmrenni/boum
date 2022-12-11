import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import {SongListItem} from '@boum/components/Library';
import {useTracksStore, useStore, useBitrateLimit} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {colours} from '@boum/constants';

type TracksScreenProps = {
  navigation: NavigationProp<any>;
};

const TracksScreen = ({navigation}: TracksScreenProps) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  // Infinite Loading
  const startIndex = useTracksStore(state => state.itemsPageIndex);
  const increaseStartIndex = useTracksStore(
    state => state.increaseItemsPageIndex,
  );
  const resetAlbumsPageIndex = useTracksStore(
    state => state.resetItemsPageIndex,
  );
  const [loadedMore, setLoadedMore] = useState(false);
  const allTracks = useTracksStore(state => state.allItems);
  const setAllTracks = useTracksStore(state => state.setAllItems);

  // Sorting & Filtering
  const sortBy = useTracksStore(state => state.sortBy);
  const setSortBy = useTracksStore(state => state.setSortBy);
  const sortOrder = useTracksStore(state => state.sortOrder);
  const setSortOrder = useTracksStore(state => state.setSortOrder);
  const searchTerm = useTracksStore(state => state.searchTerm);
  const setSearchTerm = useTracksStore(state => state.setSearchTerm);
  const filters = useTracksStore(state => state.filters);
  const setFilters = useTracksStore(state => state.setFilters);
  const {allAlbumsData, allAlbumsError, allAlbumsLoading, allAlbumsMutate} =
    jellyfin.getAllAlbums(
      session,
      startIndex,
      sortBy,
      sortOrder,
      filters,
      searchTerm,
      '',
      'Audio',
    );

  if (!allAlbumsLoading && !loadedMore && !allAlbumsError) {
    const newAlbumItems = addNewItemsToOldObject(
      startIndex,
      allTracks,
      allAlbumsData,
    );
    setAllTracks(newAlbumItems);
    setLoadedMore(true);
  }

  const mutate = () => {
    setRefreshing(true);
    resetAlbumsPageIndex();
    setAllTracks(false);
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
  const bitrateLimit = useBitrateLimit();

  const castClient = useStore(state => state.castClient);
  const castService = useStore(state => state.castService);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={allTracks.Items}
          keyExtractor={item => item.Id}
          onRefresh={() => mutate()}
          horizontal={false}
          refreshing={refreshing}
          ListHeaderComponent={
            <LibraryHeader
              text={'Tracks'}
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
            <SongListItem
              item={item}
              session={session}
              bitrateLimit={bitrateLimit}
              castClient={castClient}
              castService={castService}
            />
          )}
          onEndReached={() => {
            if (
              startIndex < allTracks.TotalRecordCount &&
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

export {TracksScreen};
