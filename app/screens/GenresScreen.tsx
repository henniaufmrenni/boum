import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import LibraryHeader from '@boum/components/Library/LibraryHeader';
import LibraryListItem from '@boum/components/Library/LibraryListItem';
import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';
import {LibraryItemList} from '@boum/types';

type GenresScreenProps = {
  navigation: NavigationProp<any>;
};

const GenresScreen: React.FC<GenresScreenProps> = ({navigation}) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const session = useStore(state => state.session);

  const [allGenres, setAllGenres] = useState<undefined | LibraryItemList>(
    undefined,
  );
  useState(() => {
    async function getGenres() {
      const genres = await jellyfin.getAllGenres(session);
      setAllGenres(genres);
    }
    getGenres();
  });

  return (
    <View style={styles.container}>
      {allGenres !== undefined ? (
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
