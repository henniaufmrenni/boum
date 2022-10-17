import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {colours} from '@boum/constants';
import {PlayerItem} from '@boum/types';

const width = Dimensions.get('window').width;

type PlayerAlbumImageProps = {
  track: PlayerItem;
};

const PlayerAlbumImage: React.FC<PlayerAlbumImageProps> = ({track}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colours.black,
    height: '100%',
  },

  text: {
    color: colours.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  albumTitle: {
    fontSize: 24,
    color: colours.white,
    marginBottom: 6,
    alignSelf: 'center',
  },
  trackTitle: {
    fontSize: 32,
    color: colours.white,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 6,
    alignSelf: 'center',
  },
  playerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  slider: {
    width: '80%',
  },
  playButton: {
    marginLeft: 20,
    marginRight: 20,
  },
  leftAction: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default PlayerAlbumImage;
