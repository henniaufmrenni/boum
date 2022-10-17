import {useEffect} from 'react';

import {createTables, getDBConnection} from '@boum/lib/db/service';

const useInitializeDb = () => {
  useEffect(() => {
    async function initDb() {
      const db = await getDBConnection().catch(err =>
        console.log('DB: error getting db ', err),
      );
      db
        ? await createTables(db)
            .then(() => console.log('DB: Created Tables'))
            .catch(err => console.log('DB: Error creating Tables ', err))
        : null;
    }
    initDb();
  }, []);
};

export {useInitializeDb};
