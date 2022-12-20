import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {colours} from '@boum/constants';
import {useArtistsStore, useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {NavigationProp} from '@react-navigation/native';

type ArtistsScreenProps = {
  navigation: NavigationProp<any>;
};

const ArtistsScreen: React.FC<ArtistsScreenProps> = ({navigation}) => {
  const jellyfin = useStore.getState().jellyfinClient;

  // TODO: Find a solution for this hack, which is necessary, since Zustand can't store JSON.
  const session = useStore(state => state.session);

  // Infinite Loading
  const startIndex = useArtistsStore(state => state.itemsPageIndex);
  const increaseStartIndex = useArtistsStore(
    state => state.increaseItemsPageIndex,
  );
  const resetStartIndex = useArtistsStore(state => state.resetItemsPageIndex);
  const [loadedMore, setLoadedMore] = useState(false);
  const allArtists = useArtistsStore(state => state.allItems);
  const setAllArtists = useArtistsStore(state => state.setAllItems);
  // Sorting
  const sortBy = useArtistsStore(state => state.sortBy);
  const setSortBy = useArtistsStore(state => state.setSortBy);
  const sortOrder = useArtistsStore(state => state.sortOrder);
  const setSortOrder = useArtistsStore(state => state.setSortOrder);
  const searchTerm = useArtistsStore(state => state.searchTerm);
  const setSearchTerm = useArtistsStore(state => state.setSearchTerm);

  const {allArtistsLoading, allArtistsData, allArtistsMutate} =
    jellyfin.getAllArtists(session, startIndex, sortBy, sortOrder, searchTerm);

  if (!allArtistsLoading && !loadedMore) {
    const newArtistItems = addNewItemsToOldObject(
      startIndex,
      allArtists,
      allArtistsData,
    );
    setAllArtists(newArtistItems);
    setLoadedMore(true);
  }

  // Pull up to refresh
  const [refreshing, setRefreshing] = useState(false);
  const mutate = async () => {
    setAllArtists(false);
    setLoadedMore(false);
    resetStartIndex();
    allArtistsMutate();
  };

  // Search and filtering modal
  const [modalOpen, setModalOpen] = useState(true);
  const updateSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    mutate();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allArtists.Items}
        keyExtractor={item => item.Id}
        onRefresh={async () => {
          setRefreshing(true);
          await mutate()
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
        }}
        ListHeaderComponent={
          <LibraryHeader
            text={'Artists'}
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
        refreshing={refreshing}
        renderItem={({item}) => (
          <LibraryListItem
            item={item}
            navigation={navigation}
            session={session}
            navigationDestination={'Artist'}
          />
        )}
        onEndReached={() => {
          if (
            startIndex < allArtists.TotalRecordCount &&
            sortBy !== 'Random' &&
            loadedMore
          ) {
            increaseStartIndex();
            setLoadedMore(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colours.black,
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
  loadingMoreText: {
    color: 'white',
    height: 200,
  },
});

export {ArtistsScreen};
