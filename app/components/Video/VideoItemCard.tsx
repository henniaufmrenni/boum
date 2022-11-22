import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {colours} from '@boum/constants';

const width = Dimensions.get('window').width;

const VideoItemCard = ({person, session}) => {
  return (
    <View style={styles.container}>
      <FastImage
        source={{
          uri: `${session.hostname}/Items/${person.Id}/Images/Primary?fillHeight=300&fillWidth=200&quality=96`,
          headers: {
            Accept: 'image/webp,*/*',
          },
        }}
        style={[
          {
            height: width * 0.45,
            width: width * 0.3,
          },
        ]}
      />
      <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
        {person.Name}
      </Text>
      <Text style={styles.role} numberOfLines={2} ellipsizeMode="tail">
        {person.Role}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: width * 0.05,
    width: width * 0.45,
    maxWidth: width * 0.45,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: colours.white,
    flexWrap: 'wrap',
  },
  role: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colours.white,
    flexWrap: 'wrap',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export {VideoItemCard};
