import React from 'react';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';
import {useStore} from '@boum/hooks';
import useStoreEncryptedValue from '@boum/hooks/useStoreEncryptedValue';

const OfflineModeSwitch = () => {
  const offlineMode = useStore(state => state.offlineMode);
  const toggleOfflineMode = useStore(state => state.toggleOfflineMode);

  return (
    <>
      {offlineMode ? (
        <ButtonBoum
          title={'Disable Offline Mode'}
          onPress={() => {
            toggleOfflineMode();
            useStoreEncryptedValue('offline_mode', 'false');
          }}
        />
      ) : (
        <ButtonBoum
          title={'Enable Offline Mode'}
          onPress={() => {
            toggleOfflineMode();
            useStoreEncryptedValue('offline_mode', 'true');
          }}
        />
      )}
    </>
  );
};

export {OfflineModeSwitch};
