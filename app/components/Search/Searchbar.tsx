import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import {colours} from '@boum/constants';
import {useSearchStore} from '@boum/hooks';

const SearchBar = () => {
  const searchInput = useSearchStore(state => state.searchInput);
  const setSearchInput = useSearchStore(state => state.setSearchInput);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        style={styles.input}
        onChangeText={(input: string) => setSearchInput(input)}
        value={searchInput}
        placeholder="Search"
        autoCorrect={false}
        placeholderTextColor={colours.grey[400]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter-Bold',
    color: colours.white,
    paddingHorizontal: 12,
    fontSize: 30,
  },
  container: {
    backgroundColor: colours.black,
    color: colours.white,
  },
  input: {
    backgroundColor: colours.black,
    width: '95%',
    alignSelf: 'center',
    borderColor: colours.grey['500'],
    borderWidth: 1,
    fontSize: 16,
    marginTop: 10,
    padding: 12,
    height: 45,
    fontFamily: 'Inter-Regular',
    borderRadius: 7,
    color: colours.white,
  },
});

export {SearchBar};
