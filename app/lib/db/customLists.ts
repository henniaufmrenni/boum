import {getDBConnection} from '@boum/lib/db/service';

import {CustomHomeListItem, SuccessMessage} from '@boum/types';

const saveCustomList = async ({
  title,
  sortOrder,
  sortBy,
  filters,
  searchQuery,
  genreId,
}: CustomHomeListItem) => {
  const db = await getDBConnection();
  let result;
  // prettier-ignore
  const insertQuery = 
    `INSERT OR REPLACE INTO custom_lists(title, sort_order, sort_by, filters, search_query, genre_id) 
     values ('${title.replace(/\'/g,"''")}', '${sortOrder}','${sortBy}','${filters ? filters : ""}','${searchQuery ?  searchQuery.replace(/\'/g,"''") : ""}','${genreId ? genreId : ""}')`;

  await db
    .executeSql(insertQuery)
    .then(res => {
      console.log('DB: Successfully custom list data');
      result = res;
    })
    .catch(err => console.warn('DB: Error saving custom list data ', err));

  return result;
};

const getCustomLists = async () => {
  const db = await getDBConnection();

  const query = `
  SELECT * 
  FROM custom_lists;`;

  let entries: Array<CustomHomeListItem> = [];

  await db
    .executeSql(query)
    .then(results => {
      //console.log('DB: Successfully read single entry');
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          const entryObject: CustomHomeListItem = {
            title: result.rows.item(index).title,
            sortOrder: result.rows.item(index).sort_order,
            sortBy: result.rows.item(index).sort_by,
            filters: result.rows.item(index).filters,
            genreId: result.rows.item(index).genre_id,
            searchQuery: result.rows.item(index).search_query,
          };
          entries.push(entryObject);
        }
      });
    })
    .catch(err => {
      console.warn('DB: Error reading custom list entry ', err);
    });

  return entries;
};

const deleteCustomList = async (title: string): Promise<SuccessMessage> => {
  const db = await getDBConnection();
  let result: SuccessMessage = 'not triggered';
  // prettier-ignore
  const query = 
    `DELETE FROM custom_lists WHERE title = '${title.replace(/\'/g,"''")}';`;

  await db
    .executeSql(query)
    .then(res => {
      console.log('DB: Successfully custom list data');
      result = 'success';
    })
    .catch(err => {
      console.warn('DB: Error saving custom list data ', err);
      result = 'fail';
    });

  return result;
};

export {saveCustomList, getCustomLists, deleteCustomList};
