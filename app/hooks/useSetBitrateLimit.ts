import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session} from '@boum/types';

const useSetBitrateLimit = async (
  session: Session,
  maxBitrateWifi: number,
  maxBitrateMobile: number,
  maxBitrateVideo?: number,
) => {
  if (maxBitrateVideo === undefined) {
    maxBitrateMobile && maxBitrateWifi
      ? ((session.maxBitrateMobile = maxBitrateMobile),
        (session.maxBitrateWifi = maxBitrateWifi))
      : maxBitrateMobile
      ? (session.maxBitrateMobile = maxBitrateMobile)
      : maxBitrateWifi
      ? (session.maxBitrateWifi = maxBitrateWifi)
      : null;
    await storeEncryptedValue('user_session', JSON.stringify(session))
      .then(() => useStore.setState({session: JSON.stringify(session)}))
      .catch(err => new Error(err));
  } else {
    session.maxBitrateVideo = maxBitrateVideo;
    await storeEncryptedValue('user_session', JSON.stringify(session))
      .then(() => useStore.setState({session: JSON.stringify(session)}))
      .catch(err => new Error(err));
  }
};

export {useSetBitrateLimit};
