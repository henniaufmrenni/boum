import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {RepeatMode} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {CastButton} from '@boum/components/Cast';
import {useStore} from '@boum/hooks';
import {toggleRepeatMode} from '@boum/lib/audio';
import {colours} from '@boum/constants';
import {HttpMethod, Session, SuccessMessage} from '@boum/types';

type PlayerMetaControlsProps = {
  navigation: NavigationProp<any>;
  session: Session;
  trackId: string;
  trackIsFavorite: boolean;
  isCastMode: boolean;
};

const PlayerMetaControls: React.FC<PlayerMetaControlsProps> = ({
  session,
  navigation,
  trackId,
  trackIsFavorite,
  isCastMode,
}) => {
  const jellyfin = useStore.getState().jellyfinClient;

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [actionStatus, setActionStatus] =
    useState<SuccessMessage>('not triggered');

  const repeatMode = useStore(state => state.repeatMode);
  const queue = useStore(state => state.queue);
  const sleepTimer = useStore(state => state.sleepTimer);
  const playbackSpeed = useStore(state => state.playbackSpeed);

  useEffect(() => {
    setIsFavorite(trackIsFavorite);
    setActionStatus('not triggered');
  }, [trackId, trackIsFavorite]);

  const changeRepeatMode = async () => {
    await toggleRepeatMode(repeatMode).then(mode =>
      useStore.setState({repeatMode: mode}),
    );
  };

  const postFavorite = async (method: HttpMethod) => {
    await jellyfin.postFavorite(session, trackId, method).then(status => {
      if (status === 200) {
        setIsFavorite(method === HttpMethod.DELETE ? false : true);
        setActionStatus('success');
      } else {
        setActionStatus('fail');
      }
    });
  };

  const navigateToQueue = () => {
    navigation.navigate('Queue', {});
  };
  return (
    <View>
      <View style={styles.playerMetaControlsContainer}>
        <View>
          {isFavorite ? (
            <TouchableOpacity onPress={() => postFavorite(HttpMethod.DELETE)}>
              <Text>
                <Icon name="heart" size={30} color={colours.accent} />
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => postFavorite(HttpMethod.POST)}>
              <Text>
                <Icon name="heart-outline" size={30} color={colours.accent} />
              </Text>
            </TouchableOpacity>
          )}
          {actionStatus === 'fail' ? (
            <Icon name="close-circle" size={20} color={'red'} />
          ) : null}
        </View>
        {!isCastMode ? (
          <>
            <TouchableOpacity onPress={navigateToQueue}>
              <Text>
                <Icon name="list-outline" size={30} color={colours.accent} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={changeRepeatMode}>
              <Text>
                <MCIcon
                  name={
                    repeatMode === RepeatMode.Track
                      ? 'repeat-once'
                      : repeatMode === RepeatMode.Queue
                      ? 'repeat'
                      : 'repeat-off'
                  }
                  size={30}
                  color={colours.accent}
                />
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
        <CastButton session={session} queue={queue} />
      </View>
      <Text style={styles.textSource}>
        {sleepTimer && sleepTimer !== 0 ? (
          <>
            <Icon name={'moon'} size={18} color={colours.white} />
            {'   '}
            {~~((sleepTimer - Date.now()) / 60000)} min
          </>
        ) : null}
        {sleepTimer && sleepTimer !== 0 && playbackSpeed !== 1 ? (
          <>{'       '}</>
        ) : null}
        {playbackSpeed !== 1 ? (
          <>
            <Icon name={'speedometer'} size={18} color={colours.white} />
            {'   '}
            {playbackSpeed}x
          </>
        ) : null}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerMetaControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '20%',
  },
  textSource: {
    fontSize: 12,
    color: colours.white,
    marginBottom: 6,
    textTransform: 'uppercase',
    fontFamily: 'Inter-Medium',
    alignSelf: 'center',
    paddingVertical: 8,
  },
});

export {PlayerMetaControls};
