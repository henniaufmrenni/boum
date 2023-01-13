import {useEffect, useState} from 'react';

import {IsDownloaded, TableName} from '@boum/types';
import {useStore} from '@boum/hooks';

const useCheckParentIsDownloaded = (itemId: string): IsDownloaded => {
  const [isDownloaded, setIsDownloaded] = useState<IsDownloaded>('loading');
  const dbService = useStore.getState().dbService;

  useEffect(() => {
    async function check() {
      const db = await dbService.getDBConnection();
      const result = await dbService.readSingleEntryId(
        db,
        TableName.ParentItems,
        itemId,
      );
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
