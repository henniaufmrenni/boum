import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {CastButton as CastFrameworkButton} from 'react-native-google-cast';
import TrackPlayer from 'react-native-track-player';

import {useStore} from '@boum/hooks';
import {Session, TrackBoum} from '@boum/types';

type CastButtonProps = {
  session: Session;
  queue: Array<TrackBoum>;
};

const CastButton: React.FC<CastButtonProps> = ({session, queue}) => {
  const service = useStore(state => state.castService);
  const client = useStore(state => state.castClient);
  const device = useStore(state => state.castDevice);

  useEffect(() => {
    async function getQueue() {
      if (client !== null && device) {
        await service
          .mapTrackPlayerQueueToCast(queue, session, 0)
          .then(mappedQueue => {
            client
              .loadMedia({
                autoplay: true,
                queueData: mappedQueue,
              })
              .catch(err => console.log(err))
              .then(() => {
                TrackPlayer.pause();
                TrackPlayer.reset();
              });
          });
      }
    }
    getQueue();
  }, [client, device, service, queue, session]);
  return <CastFrameworkButton style={styles.button} />;
};

const styles = StyleSheet.create({
  button: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export {CastButton};
