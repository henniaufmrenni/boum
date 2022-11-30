import React from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {State} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';

const width = Dimensions.get('window').width;

interface QueueItemProps extends RenderItemParams<any> {
  playerState: State;
}

const QueueItem = ({
  item,
  getIndex,
  drag,
  isActive,
  playerState,
}: QueueItemProps) => {
  const track = useStore(state => state.currentTrack);
  const index = getIndex();
  return (
    <ScaleDecorator>
      <View style={styles.rowItem}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={async () => {
            await TrackPlayer.skip(index).catch(err =>
              console.warn('Error skipping params.to song in queue: ', err),
            );
          }}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.textContainer,
            {
              backgroundColor: isActive
                ? colours.blackTransparent
                : item.backgroundColor,
            },
          ]}>
          <FastImage
            source={{
              uri: item.artwork,
              headers: {
                Accept: 'image/avif,image/webp,*/*',
              },
              priority: FastImage.priority.normal,
            }}
            style={[
              {
                width: width * 0.06,
                height: width * 0.06,
              },
            ]}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text
            style={[
              styles.text,
              {color: index === track ? colours.accent : colours.white},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.title}
          </Text>
        </TouchableOpacity>
        {index !== track ? (
          <TouchableOpacity
            onPress={async () => {
              await TrackPlayer.remove(index)
                // This weird hack is necessary, because RNTP doesn't support events for queue updates.
                //
                .then(() => {
                  if (playerState === State.Playing) {
                    TrackPlayer.pause().then(() => TrackPlayer.play());
                  } else {
                    TrackPlayer.play().then(() => TrackPlayer.pause());
                  }
                })
                .catch(() => console.log('Error removing track'));
            }}
            disabled={isActive}>
            <Icon name={'close'} color={colours.white} size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    </ScaleDecorator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    color: colours.black,
    height: '100%',
  },
  textContainer: {width: '90%', flex: 1, flexDirection: 'row'},
  text: {
    color: colours.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    paddingLeft: 10,
    maxWidth: '90%',
  },
  rowItem: {
    height: 50,
    paddingHorizontal: '5%',
    flex: 1,
    flexDirection: 'row',
  },
});

export {QueueItem};
