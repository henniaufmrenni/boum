import {useEffect, useState} from 'react';

import {
  getChildrenEntriesForParent,
  getDBConnection,
  readParentEntries,
} from '@boum/lib/db/service';
import {OfflineItem, TableName} from '@boum/types';

const getOfflineItems = async () => {
  return new Promise(async function (resolve, reject) {
    const db = await getDBConnection();

    const items = await readParentEntries(db, TableName.ParentItems).catch(
      err => reject(`Couldn't get data from DB: ${err}`),
    );

    let downloadItems: Array<OfflineItem> = [];

    items.forEach(async (item, index) => {
      const children = await getChildrenEntriesForParent(db, item.id);

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

  useEffect(() => {
    async function getItems() {
      getOfflineItems().then(res => setItems(res));
    }
    getItems();
  }, []);

  return items;
};

export default useGetDownloadItems;
