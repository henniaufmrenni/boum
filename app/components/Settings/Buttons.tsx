import React from 'react';

import {ButtonBoum} from '@boum/components/Settings';
import {useStore} from '@boum/hooks';
import useLogout from '@boum/hooks/useLogout';
import useStoreEncryptedValue from '@boum/hooks/useStoreEncryptedValue';

const LogoutButton = () => {
  return (
    <ButtonBoum
      onPress={async () =>
        await useLogout()
          .then(response => {
            console.log('Logged out', response);
          })
          .catch(error => {
            console.warn('Error logging out', error);
          })
      }
      title={'Logout'}
    />
  );
};

const OfflineModeButton = () => {
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

export {OfflineModeButton, LogoutButton};
