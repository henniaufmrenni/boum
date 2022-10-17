import {useEffect} from 'react';

import {useStore} from '@boum/hooks';
import {retrieveEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';

const useIntializeSession = async () => {
  const playerIsSetup = useStore(state => state.playerIsSetup);

  useEffect(() => {
    async function init() {
      await retrieveEncryptedValue('user_session')
        .then(async response => {
          useStore.setState({session: response});
          useStore.setState({gotLoginStatus: true});
        })
        .catch(error => {
          useStore.setState({gotLoginStatus: true});
          //console.error('No user session', error);
        });
      await retrieveEncryptedValue('offline_mode')
        .then(response => {
          //console.log('Offline Mode: ', response);
          if (response === 'true') {
            useStore.setState({offlineMode: true});
            //console.log('Read offline mode as true');
          }
          useStore.setState({gotLoginStatus: true});
        })
        .catch(error => {
          useStore.setState({gotLoginStatus: true});
          //console.error('No Offline mode set', error);
        });
    }
    init();
  }, [playerIsSetup]);
};

export {useIntializeSession};
