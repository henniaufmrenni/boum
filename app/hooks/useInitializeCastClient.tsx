import {useEffect} from 'react';
import {
  useCastDevice,
  useCastSession,
  useMediaStatus,
  useRemoteMediaClient,
} from 'react-native-google-cast';
import {useStore} from '@boum/hooks';

const useInitializeCastClient = () => {
  const setClient = useStore(state => state.setCastlient);
  const client = useRemoteMediaClient();
  useEffect(() => {
    setClient(client);
  }, [client, setClient]);

  const castSession = useCastSession();
  const setSession = useStore(state => state.setCastSession);
  useEffect(() => {
    setSession(castSession);
  }, [castSession, setSession]);

  const mediaStatus = useMediaStatus();
  const setMediaStatus = useStore(state => state.setCastMediaStatus);
  useEffect(() => {
    setMediaStatus(mediaStatus);
  }, [mediaStatus, setMediaStatus]);

  const castDevice = useCastDevice();
  const setCastDevice = useStore(state => state.setCastDevice);
  useEffect(() => {
    setCastDevice(castDevice);
  }, [castDevice, setCastDevice]);
};

export {useInitializeCastClient};
