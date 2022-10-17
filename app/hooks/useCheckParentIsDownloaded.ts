import {useEffect, useState} from 'react';

import {getDBConnection, readSingleEntryId} from '@boum/lib/db/service';
import {isDownloaded} from '@boum/types';

const useCheckParentIsDownloaded = (itemId: string): isDownloaded => {
  const [isDownloaded, setIsDownloaded] = useState('loading');

  useEffect(() => {
    async function check() {
      const db = await getDBConnection();
      const result = await readSingleEntryId(db, 'parent_items', itemId);
      if (result[0].rows.length >= 1) {
        setIsDownloaded('isDownloaded');
      } else {
        setIsDownloaded('isNotDownloaded');
      }
    }
    check();
  }, []);

  return isDownloaded;
};

export {useCheckParentIsDownloaded};
