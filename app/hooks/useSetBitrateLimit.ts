import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session} from '@boum/types';

const useSetBitrateLimit = async (
  session: Session,
  maxBitrateWifi: number,
  maxBitrateMobile: number,
  maxBitrateVideo: number,
  maxBitrateDownloadAudio: number,
) => {
  session.maxBitrateMobile = maxBitrateMobile;
  session.maxBitrateWifi = maxBitrateWifi;
  session.maxBitrateVideo = maxBitrateVideo;
  session.maxBitrateDownloadAudio = maxBitrateDownloadAudio;

  await storeEncryptedValue('user_session', JSON.stringify(session))
    .then(() => useStore.setState({session: JSON.stringify(session)}))
    .catch(err => new Error(err));
};

export {useSetBitrateLimit};
