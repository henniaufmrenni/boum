import {useEffect, useState} from 'react';

import {
  getChildrenEntriesForParent,
  getDBConnection,
  readParentEntries,
} from '@boum/lib/db/service';

const getDownloadItems = async () => {
  return new Promise(async function (resolve, reject) {
    const db = await getDBConnection();

    const items = await readParentEntries(db, 'parent_items').catch(err =>
      reject(`Couldn't get data from DB: ${err}`),
    );

    let downloadItems: [] = [];

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
  const [parents, setParents] = useState(false);

  useEffect(() => {
    async function getItems() {
      getDownloadItems().then(res => setParents(res));
    }
    getItems();
  }, []);

  return parents;
};

export {useGetDownloadItems};
