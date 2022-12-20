import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {colours} from '@boum/constants';
import {SortBy, SortOrder} from '@boum/types';

type GenreScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {name: string; itemId: string}}>;
};

const GenreScreen: React.FC<GenreScreenProps> = ({navigation, route}) => {
  const {itemId, name} = route.params;

  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  // We keep state local since it would be shared with all other genre screens otherwise
  // Infinite Loading
  const [startIndex, setStartIndex] = useState(0);
  const increaseStartIndex = () => {
    setStartIndex(startIndex + 40);
  };
  const resetPageIndex = () => setStartIndex(0);
  const [loadedMore, setLoadedMore] = useState(false);
  const [allItems, setAllItems] = useState(false);

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<SortBy>('SortName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('Ascending');
  const [searchTerm, setSearchTerm] = useState('');
  const {allAlbumsData, allAlbumsError, allAlbumsLoading, allAlbumsMutate} =
    jellyfin.getAllAlbums(
      session,
      startIndex,
      sortBy,
      sortOrder,
      '',
      searchTerm,
      itemId,
    );

  if (!allAlbumsLoading && !loadedMore && !allAlbumsError) {
    const newAlbumItems = addNewItemsToOldObject(
      startIndex,
      allItems,
      allAlbumsData,
    );
    setAllItems(newAlbumItems);
    setLoadedMore(true);
  }

  const mutate = () => {
    setRefreshing(true);
    resetPageIndex();
    setAllItems(false);
    allAlbumsMutate();
    setLoadedMore(false);
    setRefreshing(false);
  };

  // Pullup to refresh
  const [refreshing, setRefreshing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    mutate();
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={allItems.Items}
          keyExtractor={item => item.Id}
          onRefresh={() => mutate()}
          horizontal={false}
          refreshing={refreshing}
          ListHeaderComponent={
            <LibraryHeader
              text={name}
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
              navigationDestination={'Album'}
            />
          )}
          onEndReached={() => {
            if (startIndex < allItems.TotalRecordCount && sortBy !== 'Random') {
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

export {GenreScreen};
