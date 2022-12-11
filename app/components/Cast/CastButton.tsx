import {useStore} from '@boum/hooks';
import {Session, TrackBoum} from '@boum/types';
import React, {useEffect} from 'react';
import {CastButton as CastFrameworkButton} from 'react-native-google-cast';
import TrackPlayer from 'react-native-track-player';

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
              .then(res => {
                TrackPlayer.pause();
                TrackPlayer.reset();
              });
          });
      }
    }

    getQueue();
  }, [client, device]);
  return (
    <CastFrameworkButton style={{width: 24, height: 24, tintColor: 'white'}} />
  );
};

export {CastButton};
