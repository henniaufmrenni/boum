import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colours} from '@boum/constants';

import Icon from 'react-native-vector-icons/Ionicons';
import {deleteCustomList} from '@boum/lib/db/customLists';
import {CustomHomeListItem, SuccessMessage} from '@boum/types';
import {useStore} from '@boum/hooks';

type CustomListItemProps = {
  list: CustomHomeListItem;
};

const CustomListItem = ({list}: CustomListItemProps) => {
  const [successMessage, setSuccessMessage] =
    useState<SuccessMessage>('not triggered');

  const triggerRefreshHomeScreen = useStore(
    state => state.setRefreshHomeScreen,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{list.title}</Text>
      <TouchableOpacity
        onPress={async () =>
          await deleteCustomList(list.title).then(res => {
            setSuccessMessage(res);
            triggerRefreshHomeScreen();
          })
        }>
        {successMessage === 'not triggered' ? (
          <Icon name="ios-trash" size={28} color={colours.white} />
        ) : successMessage === 'success' ? (
          <Icon name="checkmark-circle" size={28} color={colours.green} />
        ) : (
          <Icon name="ios-close-circle" size={28} color={'red'} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
    fontSize: 18,
    width: '90%',
    marginVertical: 12,
    fontFamily: 'Inter-Medium',
  },
  picker: {
    width: '70%',
    color: 'white',
    backgroundColor: colours.grey['700'],
  },
});

export {CustomListItem};
