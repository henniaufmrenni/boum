import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';

type GenresScreenProps = {
  navigation: NavigationProp<any>;
};

const GenresScreen: React.FC<GenresScreenProps> = ({navigation}) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  const {allGenres, allGenresError, allGenresLoading} =
    jellyfin.getAllGenres(session);

  return (
    <View style={styles.container}>
      {!allGenresError && !allGenresLoading && allGenres !== undefined ? (
        <FlatList
          data={allGenres.Items}
          keyExtractor={item => item.Name}
          ListHeaderComponent={
            <LibraryHeader text={'Genres'} disableFiltering={true} />
          }
          renderItem={({item}) => (
            <LibraryListItem
              item={item}
              navigation={navigation}
              session={session}
              navigationDestination={'Genre'}
            />
          )}
        />
      ) : (
        <LoadingSpinner />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    flex: 2,
    backgroundColor: colours.black,
  },
  error: {
    textAlign: 'center',
  },
});

export {GenresScreen};
