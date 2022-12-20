import React from 'react';
import {StyleSheet} from 'react-native';
import {
  DragEndParams,
  NestableDraggableFlatList,
  NestableScrollContainer,
} from 'react-native-draggable-flatlist';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

import {QueueItem} from '@boum/components/Queue';
import SingleItemHeader from '@boum/components/SingleItemHeader';
import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';

type QueueScreenProps = {
  navigation: NavigationProp<any>;
};

const QueueScreen: React.FC<QueueScreenProps> = ({navigation}) => {
  const queue = useStore(state => state.queue);
  const setPlaybackUpdate = useStore(state => state.setPlaybackUpdate);

  const keyExtractor = (item: object, index: number) => item.id + index;
  const playerState = usePlaybackState();

  const onDragEnd = async (params: DragEndParams<object>) => {
    const track = queue[params.from];

    if (params.from > params.to) {
      await TrackPlayer.add(track, params.to)
        .catch(err => console.warn('Error adding moving song in queue: ', err))
        .then(async () => {
          await TrackPlayer.remove(params.from + 1)
            .catch(err =>
              console.warn('Error adding moving song in queue: ', err),
            )
            .then(() => setPlaybackUpdate());
        });
    } else {
      await TrackPlayer.add(track, params.to + 1)
        .catch(err => console.warn('Error adding moving song in queue: ', err))
        .then(async () => {
          await TrackPlayer.remove(params.from)
            .catch(err =>
              console.warn('Error adding moving song in queue: ', err),
            )
            .then(() => setPlaybackUpdate());
        });
    }
  };

  return (
    <NestableScrollContainer style={styles.container}>
      <SingleItemHeader navigation={navigation} />
      <NestableDraggableFlatList
        data={queue}
        renderItem={({item, getIndex, drag, isActive}) =>
          QueueItem({item, getIndex, drag, isActive, playerState})
        }
        keyExtractor={keyExtractor}
        onDragEnd={async params => await onDragEnd(params)}
      />
    </NestableScrollContainer>
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

export {QueueScreen};
