import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {LoadingSpinner} from '@boum/components/Generic';
import {HeaderHome, CustomHomeLists} from '@boum/components/Home';
import {AlbumCard} from '@boum/components/Library/AlbumCard';
import OfflineListView from '@boum/components/OfflineListView';
import {colours, sizes} from '@boum/constants';
import {useGetCustomLists, useStore} from '@boum/hooks';
import {useGetHome} from '@boum/hooks/useGetHome';
import {NavigationProp} from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);
  const session = useStore(state => state.session);

  const {
    latestAlbums,
    latestAlbumsLoading,
    frequentlyPlayedAlbums,
    frequentlyPlayedAlbumsLoading,
    recentlyPlayedAlbums,
    randomAlbumsLoading,
    favoriteAlbums,
    favoriteAlbumsLoading,
    randomAlbums,
    recentlyPlayedAlbumsLoading,
    mutateGetHome,
  } = useGetHome(session);

  const offlineMode = useStore(state => state.offlineMode);
  const customLists = useStore(state => state.customLists);
  useGetCustomLists(triggerRefresh);

  const onRefresh = () => {
    setRefreshing(true);
    mutateGetHome();
    setTriggerRefresh(triggerRefresh + 1);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HeaderHome session={session} navigation={navigation} />
      {session.offlineMode ? (
        <OfflineListView navigation={navigation} session={session} />
      ) : (
        <View>
          {customLists ? (
            <CustomHomeLists data={customLists} navigation={navigation} />
          ) : (
            <LoadingSpinner />
          )}
          {randomAlbums ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('List', {
                    sortBy: 'Random',
                    sortOrder: 'Ascending',
                    filters: '',
                    listTitle: 'Random',
                  });
                }}>
                <Text style={styles.text}>Random Albums ▸</Text>
              </TouchableOpacity>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {randomAlbums.Items.map(album => (
                  <AlbumCard
                    key={album.Id}
                    item={album}
                    navigation={navigation}
                    navigationDestination={'Album'}
                    session={session}
                  />
                ))}
              </ScrollView>
            </>
          ) : randomAlbumsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.text}>Random Albums</Text>
              <LoadingSpinner />
            </View>
          ) : (
            <Text style={styles.text}>Error random</Text>
          )}
          {latestAlbums ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('List', {
                    sortBy: 'DateCreated',
                    sortOrder: 'Descending',
                    filters: '',
                    listTitle: 'Latest',
                  });
                }}>
                <Text style={styles.text}>Latest Albums ▸</Text>
              </TouchableOpacity>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {latestAlbums.map(album => (
                  <AlbumCard
                    key={album.Id}
                    item={album}
                    navigation={navigation}
                    navigationDestination={'Album'}
                    session={session}
                  />
                ))}
              </ScrollView>
            </>
          ) : latestAlbumsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.text}>Latest Albums</Text>
              <LoadingSpinner />
            </View>
          ) : (
            <Text style={styles.text}>Error latest</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('List', {
                sortBy: 'SortName',
                sortOrder: 'Ascending',
                filters: 'IsFavorite',
                listTitle: 'Favourites',
              });
            }}>
            <Text style={styles.text}>Favourites ▸</Text>
          </TouchableOpacity>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {favoriteAlbums ? (
              <>
                {favoriteAlbums.Items.map(album => (
                  <AlbumCard
                    key={album.Id}
                    item={album}
                    navigation={navigation}
                    navigationDestination={'Album'}
                    session={session}
                  />
                ))}
              </>
            ) : favoriteAlbumsLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.text}>Favorites</Text>
                <LoadingSpinner />
              </View>
            ) : (
              <Text style={styles.text}>Error Favourites</Text>
            )}
          </ScrollView>
          <Text style={styles.text}>Frequently Played</Text>
          {frequentlyPlayedAlbums ? (
            <>
              <>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {frequentlyPlayedAlbums.Items.map(album => (
                    <AlbumCard
                      key={album.Id}
                      item={album}
                      navigation={navigation}
                      navigationDestination={'Album'}
                      session={session}
                    />
                  ))}
                </ScrollView>
              </>
            </>
          ) : frequentlyPlayedAlbumsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.text}>Frequently Played</Text>
              <LoadingSpinner />
            </View>
          ) : (
            <Text style={styles.text}>Error frequent</Text>
          )}
          {recentlyPlayedAlbums ? (
            <>
              <Text style={styles.text}>Recently Played</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <>
                  {recentlyPlayedAlbums.Items.map(album => (
                    <AlbumCard
                      key={album.Id}
                      item={album}
                      navigation={navigation}
                      navigationDestination={'Album'}
                      session={session}
                    />
                  ))}
                </>
              </ScrollView>
            </>
          ) : recentlyPlayedAlbumsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.text}>Recently Played</Text>
              <LoadingSpinner />
            </View>
          ) : (
            <Text style={styles.text}>Error Recent</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
    color: 'white',
  },
  loadingContainer: {
    height: '25%',
  },
  text: {
    paddingLeft: sizes.marginListX,
    paddingRight: sizes.marginListX,
    paddingBottom: sizes.marginListX,
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
  },
});

export {HomeScreen};
