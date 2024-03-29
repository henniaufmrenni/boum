import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {CustomListCreator} from '@boum/components/Settings';
import {useGetCustomLists} from '@boum/hooks/useGetCustomLists';
import {CustomListItem} from '@boum/components/Settings/CustomListItem';

const ListManagerScreen: React.FC = () => {
  const session = useStore(state => state.session);
  const refreshHomeScreen = useStore(state => state.refreshHomeScreen);
  const customLists = useStore(state => state.customLists);

  useGetCustomLists(refreshHomeScreen);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Custom Lists</Text>
      {customLists && customLists.length >= 1 ? (
        <>
          <Text style={styles.text}>Your current lists:</Text>
          <View style={styles.listContainer}>
            {customLists
              ? customLists.map(list => (
                  <CustomListItem list={list} key={list.title} />
                ))
              : null}
          </View>
        </>
      ) : null}
      <CustomListCreator session={session} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
  },
  header: {
    color: colours.white,
    paddingTop: 30,
    fontSize: 32,
    fontFamily: 'Inter-ExtraBold',
    justifyContent: 'flex-start',
    textAlign: 'center',
  },
  listContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  text: {
    color: colours.white,
    fontSize: 20,
    paddingVertical: 16,
    paddingHorizontal: 15,
    fontFamily: 'Inter-Medium',
  },
  picker: {
    width: '70%',
    color: 'white',
    backgroundColor: colours.grey['700'],
  },
});

export {ListManagerScreen};
