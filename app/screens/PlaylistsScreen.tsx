import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {LoadingSpinner} from '@boum/components/Generic';
import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {colours} from '@boum/constants';
import {usePlaylistsStore, useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {NavigationProp} from '@react-navigation/native';

type PlaylistsScreenProps = {
  navigation: NavigationProp<any>;
};

const PlaylistsScreen: React.FC<PlaylistsScreenProps> = ({navigation}) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  // Infinite Loading
  const startIndex = usePlaylistsStore(state => state.itemsPageIndex);
  const increaseStartIndex = usePlaylistsStore(
    state => state.increaseItemsPageIndex,
  );
  const resetAlbumsPageIndex = usePlaylistsStore(
    state => state.resetItemsPageIndex,
  );
  const [loadedMore, setLoadedMore] = useState(false);
  const allPlaylists = usePlaylistsStore(state => state.allItems);
  const setAllPlaylists = usePlaylistsStore(state => state.setAllItems);

  // Sorting & Filtering
  const sortBy = usePlaylistsStore(state => state.sortBy);
  const setSortBy = usePlaylistsStore(state => state.setSortBy);
  const sortOrder = usePlaylistsStore(state => state.sortOrder);
  const setSortOrder = usePlaylistsStore(state => state.setSortOrder);
  const searchTerm = usePlaylistsStore(state => state.searchTerm);
  const setSearchTerm = usePlaylistsStore(state => state.setSearchTerm);
  const {
    allPlaylistsData,
    allPlaylistsError,
    allPlaylistsLoading,
    allPlaylistsMutate,
  } = jellyfin.getAllPlaylists(
    session,
    startIndex,
    sortBy,
    sortOrder,
    '',
    searchTerm,
  );

  if (!allPlaylistsLoading && !loadedMore && !allPlaylistsError) {
    const newAlbumItems = addNewItemsToOldObject(
      startIndex,
      allPlaylists,
      allPlaylistsData,
    );
    setAllPlaylists(newAlbumItems);
    setLoadedMore(true);
  }

  const mutate = () => {
    setRefreshing(true);
    resetAlbumsPageIndex();
    setAllPlaylists(false);
    allPlaylistsMutate();
    setLoadedMore(false);
    setRefreshing(false);
  };

  // Pullup to refresh
  const [refreshing, setRefreshing] = useState(false);

  // Search and filtering modal
  const [modalOpen, setModalOpen] = useState(true);
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    mutate();
  };

  return (
    <>
      <View style={styles.container}>
        {allPlaylists ? (
          <FlatList
            data={allPlaylists.Items}
            keyExtractor={item => item.Id}
            onRefresh={() => mutate()}
            horizontal={false}
            refreshing={refreshing}
            ListHeaderComponent={
              <LibraryHeader
                text={'Playlists'}
                sortBy={sortBy}
                setSortBy={setSortBy}
                mutate={mutate}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                searchTerm={searchTerm}
                setSearchTerm={updateSearchTerm}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
              />
            }
            renderItem={({item}) => (
              <LibraryListItem
                item={item}
                navigation={navigation}
                session={session}
                navigationDestination={'Playlist'}
              />
            )}
            onEndReached={() => {
              if (
                startIndex < allPlaylists.TotalRecordCount &&
                sortBy !== 'Random'
              ) {
                increaseStartIndex();
                setLoadedMore(false);
              }
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

export {PlaylistsScreen};
