import TrackPlayer from 'react-native-track-player';

import {useStore} from '@boum/hooks';
import {clearAllEncryptedValues} from '@boum/lib/encryptedStorage/encryptedStorage';

const useLogout = async () => {
  try {
    await clearAllEncryptedValues();
    useStore.setState({session: false});
    await TrackPlayer.reset();
    return 'Succesfully logged out.';
  } catch (error) {
    return 'Error in saving User session.';
  }
};

export default useLogout;
