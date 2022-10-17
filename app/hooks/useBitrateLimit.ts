import {useStore} from '@boum/hooks';
import {useNetInfo} from '@react-native-community/netinfo';

const useBitrateLimit = () => {
  const netInfo = useNetInfo();
  let bitrateLimit = 140000000;
  if (netInfo.type === 'wifi') {
    const session = useStore.getState().session;
    const limit = JSON.parse(session).maxBitrateWifi;
    bitrateLimit = limit;
  } else if (netInfo.type === 'cellular') {
    const session = useStore.getState().session;
    const limit = JSON.parse(session).maxBitrateWifi;
    bitrateLimit = limit;
  }
  return bitrateLimit;
};

export {useBitrateLimit};
