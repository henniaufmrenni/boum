import {useEffect, useState} from 'react';

import {DbService} from '@boum/lib/db/Service';
import {useStore} from '@boum/hooks';
import {TableName} from '@boum/types';

const getDownloadItems = async (dbService: DbService) => {
  return new Promise(async function (resolve, reject) {
    const db = await dbService.getDBConnection();

    const items = await dbService
      .readParentEntries(db, TableName.ParentItems)
      .catch(err => reject(`Couldn't get data from DB: ${err}`));

    let downloadItems: Array<any> = [];

    items.forEach(async (item, index) => {
      const children = await dbService.getChildrenEntriesForParent(db, item.id);

      downloadItems.push({
        id: item.id,
        name: item.name,
        metadata: item.metadata,
        children: children,
      });
      if (items.length === index + 1) {
        resolve(downloadItems);
      }
    });
  });
};

const useGetDownloadItems = (refresh?: boolean) => {
  const [downloadItems, setDownloadItems] = useState<boolean | Array<object>>(
    false,
  );
  const [gotDownloadItems, setGotDownloadItems] = useState<boolean>(false);
  const [time, setTime] = useState(Date.now());
  const dbService = useStore.getState().dbService;

  useEffect(() => {
    if (refresh) {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    async function getItems() {
      getDownloadItems(dbService).then(res => {
        setDownloadItems(res);
      });
    }
    getItems().then(() => setGotDownloadItems(true));
  }, [time]);

  return {downloadItems, gotDownloadItems};
};

export {useGetDownloadItems};
