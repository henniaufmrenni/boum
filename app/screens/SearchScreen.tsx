import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {RowNavigation, RowSongs, SearchBar} from '@boum/components/Search';
import {colours} from '@boum/constants';
import {useCancelableSearch, useSearchStore, useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';

type SearchScreenProps = {
  navigation: NavigationProp<any>;
};

const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const session = useStore(state => state.session);

  const searchInput = useSearchStore(state => state.searchInput);
  const res = useCancelableSearch(session, searchInput);

  return (
    <ScrollView style={styles.container}>
      <SearchBar />
      <View style={styles.viewContainer}>
        {searchInput.length >= 1 &&
        res !== undefined &&
        res.albums !== undefined ? (
          <>
            <RowSongs songs={res.songs} session={session} />
            <RowNavigation
              albums={res.artists}
              navigation={navigation}
              navigationDestination={'Artist'}
              session={session}
            />
            <RowNavigation
              albums={res.albums}
              navigation={navigation}
              navigationDestination={'Album'}
              session={session}
            />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
    color: colours.white,
    paddingTop: 35,
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
  },
  result: {
    backgroundColor: colours.accent,
    color: colours.white,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    color: colours.black,
    backgroundColor: colours.white,
    borderRadius: 5,
  },
});

export {SearchScreen};
