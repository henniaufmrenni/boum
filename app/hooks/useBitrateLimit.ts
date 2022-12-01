import {useStore} from '@boum/hooks';
import {useNetInfo} from '@react-native-community/netinfo';

const useBitrateLimit = () => {
  const netInfo = useNetInfo();

  const session = useStore.getState().session;

  let bitrateLimit: number = 140000000;

  if (netInfo.type === 'wifi') {
    const limit = JSON.parse(session).maxBitrateWifi;
    bitrateLimit = limit;
  } else if (netInfo.type === 'cellular') {
    const limit = JSON.parse(session).maxBitrateMobile;
    bitrateLimit = limit;
  }
  return bitrateLimit;
};

export {useBitrateLimit};
