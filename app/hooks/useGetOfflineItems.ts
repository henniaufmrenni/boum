import {useEffect, useState} from 'react';

import {DbService} from '@boum/lib/db/Service';
import {useStore} from '@boum/hooks';
import {OfflineItem, TableName} from '@boum/types';

const getOfflineItems = async (dbService: DbService) => {
  return new Promise(async function (resolve, reject) {
    const db = await dbService.getDBConnection();

    const items = await dbService
      .readParentEntries(db, TableName.ParentItems)
      .catch(err => reject(`Couldn't get data from DB: ${err}`));

    let downloadItems: Array<OfflineItem> = [];

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

const useGetDownloadItems = () => {
  const [items, setItems] = useState(false);
  const dbService = useStore.getState().dbService;

  useEffect(() => {
    async function getItems() {
      getOfflineItems(dbService).then(res => setItems(res));
    }
    getItems();
  }, []);

  return items;
};

export default useGetDownloadItems;
