import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {colours} from '@boum/constants';
import {PlayerItem} from '@boum/types';

const width = Dimensions.get('window').width;

type PlayerAlbumImageProps = {
  track: PlayerItem;
};

const PlayerAlbumImage: React.FC<PlayerAlbumImageProps> = ({track}) => {
  return (
    <View style={styles.container}>
      <FastImage
        source={{
          uri: track.artwork,
          headers: {
            Accept: 'image/avif,image/webp,*/*',
          },
          priority: FastImage.priority.normal,
        }}
        style={[
          styles.image,
          {
            width: width * 0.8,
            height: width * 0.8,
          },
        ]}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    shadowColor: '#2a2a2a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  image: {
    alignSelf: 'center',
  },
});

export default PlayerAlbumImage;
