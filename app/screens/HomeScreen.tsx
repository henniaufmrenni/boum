import React, {useCallback, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {LoadingSpinner} from '@boum/components/Generic';
import {HeaderHome} from '@boum/components/Home';
import {AlbumCard} from '@boum/components/Library/AlbumCard';
import OfflineListView from '@boum/components/OfflineListView';
import {colours, sizes} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {useGetHome} from '@boum/hooks/useGetHome';
import {Session} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    mutateGetHome();
    setRefreshing(false);
  }, [mutateGetHome]);

  const offlineMode = useStore(state => state.offlineMode);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HeaderHome session={session} navigation={navigation} />
      {offlineMode ? (
        <OfflineListView navigation={navigation} session={session} />
      ) : (
        <View>
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
