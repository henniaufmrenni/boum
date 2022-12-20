import {useEffect, useState} from 'react';

import {getDBConnection, readSingleEntryId} from '@boum/lib/db/service';
import {IsDownloaded, TableName} from '@boum/types';

const useCheckParentIsDownloaded = (itemId: string): IsDownloaded => {
  const [isDownloaded, setIsDownloaded] = useState<IsDownloaded>('loading');

  useEffect(() => {
    async function check() {
      const db = await getDBConnection();
      const result = await readSingleEntryId(db, TableName.ParentItems, itemId);
      if (result[0].rows.length >= 1) {
        setIsDownloaded('isDownloaded');
      } else {
        setIsDownloaded('isNotDownloaded');
      }
    }
    check();
  }, [itemId]);

  return isDownloaded;
};

export {useCheckParentIsDownloaded};
