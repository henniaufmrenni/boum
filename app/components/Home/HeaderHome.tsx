import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours, sizes} from '@boum/constants';
import {capitalizeFirstLetter} from '@boum/lib/helper/helper';
import {Session} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

type HeaderHomeProps = {
  navigation: NavigationProp<any>;
  session: Session;
};

const HeaderHome: React.FC<HeaderHomeProps> = ({navigation, session}) => {
  return (
    <View style={styles.container}>
      {session ? (
        <Text style={styles.text}>
          Welcome {capitalizeFirstLetter(session.username)}
        </Text>
      ) : null}
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text>
          <Icon name="ios-settings-outline" size={22} color={colours.white} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colours.black,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.marginListX,
    paddingTop: 35,
    paddingBottom: sizes.marginListY / 2,
  },
  text: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
  },
});

export {HeaderHome};
