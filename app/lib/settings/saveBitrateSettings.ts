import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session, SelectedStorageLocation} from '@boum/types';

const saveBitrateSettings = async (
  session: Session,
  maxBitrateWifi: number,
  maxBitrateMobile: number,
  maxBitrateVideo: number,
  maxBitrateDownloadAudio: number,
  selectedStorageLocation: SelectedStorageLocation,
) => {
  session.maxBitrateMobile = maxBitrateMobile;
  session.maxBitrateWifi = maxBitrateWifi;
  session.maxBitrateVideo = maxBitrateVideo;
  session.maxBitrateDownloadAudio = maxBitrateDownloadAudio;
  session.selectedStorageLocation = selectedStorageLocation;

  await storeEncryptedValue('user_session', JSON.stringify(session))
    .then(() => useStore.setState({session: session}))
    .catch(err => new Error(err));
};

export {saveBitrateSettings};
