import {useEffect} from 'react';

import {useStore} from '@boum/hooks';
import {retrieveEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';

const useIntializeSession = async () => {
  const playerIsSetup = useStore(state => state.playerIsSetup);

  useEffect(() => {
    async function init() {
      await retrieveEncryptedValue('user_session')
        .then(async response => {
          const json = JSON.parse(response);
          useStore.setState({session: json});
          useStore.setState({gotLoginStatus: true});
        })
        .catch(error => {
          useStore.setState({gotLoginStatus: true});
          console.error('No user session', error);
        });

      await retrieveEncryptedValue('offline_mode')
        .then(response => {
          if (response === 'true') {
            useStore.setState({offlineMode: true});
          }
        })
        .catch(error => {
          console.error('No Offline mode set', error);
        });

      await retrieveEncryptedValue('selected_storage_location')
        .then(async response => {
          useStore.setState({selectedStorageLocation: response});
        })
        .catch(error => {
          console.error('No storage location set', error);
          useStore.setState({selectedStorageLocation: 'DocumentDirectory'});
        });
    }
    init();
  }, [playerIsSetup]);
};

export {useIntializeSession};
