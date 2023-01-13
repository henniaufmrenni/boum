import {useEffect} from 'react';

import {useStore} from '@boum/hooks';

const useInitializeDb = () => {
  const dbService = useStore.getState().dbService;

  useEffect(() => {
    async function initDb() {
      const db = await dbService
        .getDBConnection()
        .catch(err => console.log('DB: error getting db ', err));
      db
        ? await dbService
            .createTables(db)
            .then(() => console.log('DB: Created Tables'))
            .catch(err => console.log('DB: Error creating Tables ', err))
        : null;
    }
    initDb();
  }, []);
};

export {useInitializeDb};
