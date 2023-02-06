import TrackPlayer from 'react-native-track-player';

import {useStore} from '@boum/hooks';
import {clearAllEncryptedValues} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session} from '@boum/types';
import {DbService} from '@boum/lib/db';

const initialSession: Session = {
  hostname: '',
  accessToken: '',
  userId: '',
  username: '',
  maxBitrateWifi: 140000000,
  maxBitrateMobile: 140000000,
  maxBitrateVideo: 100000000,
  maxBitrateDownloadAudio: 140000000,
  deviceName: '',
  deviceId: '',
  chromecastAdress: null,
  chromecastAdressEnabled: false,
  offlineMode: false,
  selectedStorageLocation: 'DocumentDirectory',
};

const logout = async () => {
  const dbService = new DbService();
  try {
    await clearAllEncryptedValues();
    useStore.setState({session: initialSession});
    const db = await dbService.getDBConnection();
    await TrackPlayer.reset();
    dbService.deleteAllRows(db);
    return 'Succesfully logged out.';
  } catch (error) {
    return 'Error in saving User session.';
  }
};

export {logout};
