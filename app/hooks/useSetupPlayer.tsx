import {useEffect} from 'react';

import {useStore} from '@boum/hooks';
import {SetupService} from '@boum/lib/audio';

const useSetupPlayer = async () => {
  useEffect(() => {
    async function run() {
      const isSetup = await SetupService();
      useStore.setState({playerIsSetup: isSetup});
    }
    run();
  }, []);
};

export {useSetupPlayer};
