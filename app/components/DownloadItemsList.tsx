import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours} from '@boum/constants';
import {useNavigation} from '@react-navigation/native';

const DownloadItemsList = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableHighlight title="Close" onPress={() => navigation.goBack()}>
        <Text>
          <Icon name="ios-arrow-back" size={25} color={colours.black} />
        </Text>
      </TouchableHighlight>
      <Text>Test</Text>
      <TouchableHighlight title="Menu" onPress={() => navigation.goBack()}>
        <Text>
          <Icon name="ios-arrow-back" size={25} color={colours.black} />
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    color: 'black',
    fontSize: 42,
    fontWeight: '100',
    textAlign: 'center',
  },
});

export default DownloadItemsList;
