import React from 'react';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';
import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session} from '@boum/types';

type OfflineModeSwitchProps = {
  session: Session;
};

const OfflineModeSwitch: React.FC<OfflineModeSwitchProps> = ({session}) => {
  const saveOfflineModeEnabled = () => {
    session.offlineMode === true
      ? (session.offlineMode = false)
      : (session.offlineMode = true);
    storeEncryptedValue('user_session', JSON.stringify(session))
      .then(() => {
        useStore.setState({session: undefined});
        useStore.setState({session: session});
      })
      .catch(err => new Error(err));
  };
  return (
    <>
      <ButtonBoum
        title={(session.offlineMode ? 'Disable ' : 'Enable ') + 'Offline Mode'}
        onPress={saveOfflineModeEnabled}
      />
    </>
  );
};

export {OfflineModeSwitch};
