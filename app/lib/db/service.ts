/* eslint-disable quotes */
/* eslint-disable no-useless-escape */

import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

import {DownloadStatus, TableName} from '@boum/types';

const tableName = TableName;

SQLite.enablePromise(true);

const getDBConnection = async () => {
  return SQLite.openDatabase({name: 'boum.db', location: 'default'});
};

const createTables = async (db: SQLiteDatabase) => {
  // prettier-ignore
  const createParentItemsTable = `
  CREATE TABLE IF NOT EXISTS ${tableName.ParentItems}(
    id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    metadata TEXT NOT NULL,
    PRIMARY KEY (id)
 );`;

  await db
    .executeSql(createParentItemsTable)
    .then(() => console.log('Successfully created parents table.'))
    .catch(() => console.log('Error creating parents table.'));

  // prettier-ignore
  const createIdTable = `
  CREATE TABLE IF NOT EXISTS ${tableName.SingleItems}(
    id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    file_location TEXT NOT NULL,
    image_location TEXT NOT NULL,
    metadata TEXT NOT NULL,
    status TEXT NOT NULL, 
    parent_id TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) 
       REFERENCES ${tableName.ParentItems} (id) 
          ON DELETE NO ACTION 
          ON UPDATE NO ACTION
 );`;

  await db
    .executeSql(createIdTable)
    .then(() => console.log('Successfully created single items table.'))
    .catch(() => console.log('Error creating single items table.'));

  const createKeyValueTable = `
    CREATE TABLE IF NOT EXISTS ${tableName.KeyValue}(
      key TEXT NOT NULL UNIQUE,
      value TEXT
    );`;

  await db
    .executeSql(createKeyValueTable)
    .then(() => console.log('Successfully created key value table.'))
    .catch(err => console.log('Error creating key value table: ', err));

  // prettier-ignore
  const createCustomListsTable = `
  CREATE TABLE IF NOT EXISTS ${tableName.CustomLists}(
    title TEXT NOT NULL UNIQUE,
    sort_order TEXT NOT NULL,
    sort_by TEXT NOT NULL,
    filters TEXT NOT NULL,
    search_query TEXT NOT NULL, 
    genre_id TEXT NOT NULL
 );`;

  await db
    .executeSql(createCustomListsTable)
    .then(() => console.log('Successfully created custom lists table.'))
    .catch(() => console.log('Error creating custom lists table.'));

  await db
    .executeSql(`SELECT * FROM sqlite_master where type='table'`)
    .catch(err => console.log('Error retrieving DB tables', err));
};

const createSingleItemEntries = async (
  db: SQLiteDatabase,
  albumItem: object,
  fileLocation: string,
  parentId: string,
  imageLocation: string,
) => {
  // prettier-ignore
  const insertQuery =
  `INSERT OR REPLACE INTO ${tableName.SingleItems}(id, name, file_location, image_location, metadata, status, parent_id) 
   values ('${albumItem.Id}', '${albumItem.Name.replace(/\'/g,"''")}', '${fileLocation.replace(/\'/g,"''")
  }', '${imageLocation.replace(/\'/g,"''")}', '${JSON.stringify(albumItem).replace(/\'/g,"''")}', 'started', '${parentId}')`;

  await db
    .executeSql(insertQuery)
    .then(() => console.log('DB: Successfully saved single item data'))
    .catch(err => console.warn('DB: Error saving single item data: ', err));
  return;
};

const createParentItemEntries = async (
  db: SQLiteDatabase,
  parentItem: object,
) => {
  // prettier-ignore
  const insertQuery =
  `INSERT OR REPLACE INTO ${tableName.ParentItems}(id, name, metadata) 
   values ('${parentItem.Id}', '${parentItem.Name.replace(/\'/g,"''")}','${JSON.stringify(parentItem).replace(/\'/g,"''")}')`;

  await db
    .executeSql(insertQuery)
    .then(() => console.log('DB: Successfully saved parent data'))
    .catch(err => console.warn('DB: Error saving parent data ', err));
  return;
};

const updateSingleItemStatus = async (
  db: SQLiteDatabase,
  itemId: string,
  status: DownloadStatus,
) => {
  // prettier-ignore
  const insertQuery =
  `UPDATE ${tableName.SingleItems}
   SET status = ('${status}')
   WHERE id = '${itemId}'; `;

  await db
    .executeSql(insertQuery)
    .then(() => console.log('DB: Successfully updated status'))
    .catch(err => console.warn('DB: Error updating status', err));
  return;
};

const readSingleEntry = async (
  db: SQLiteDatabase,
  table: TableName,
  itemId: string,
) => {
  let result;
  // prettier-ignore
  const query = `
  SELECT * 
  FROM ${table} 
  WHERE id = ('${itemId}');`;
  await db
    .executeSql(query)
    .then(res => {
      //console.log('DB: Successfully read single entry');
      result = res;
    })
    .catch(err => {
      console.warn('DB: Error reading single entry ', err);
      result = err;
    });

  return result;
};

const readSingleEntryId = async (
  db: SQLiteDatabase,
  table: TableName,
  itemId: string,
) => {
  let result;
  // prettier-ignore
  const query = `
  SELECT id 
  FROM ${table} 
  WHERE id = ('${itemId}');`;
  await db
    .executeSql(query)
    .then(res => {
      //console.log('DB: Successfully read single entry');
      result = res;
    })
    .catch(err => {
      console.warn('DB: Error reading single entry ', err);
      result = err;
    });

  return result;
};

export const readParentEntries = async (
  db: SQLiteDatabase,
  table: TableName,
) => {
  const query = `
  SELECT * 
  FROM ${table};`;

  let entries: [] = [];

  await db
    .executeSql(query)
    .then(results => {
      //console.log('DB: Successfully read single entry');
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          const entryObject = {
            id: result.rows.item(index).id,
            name: result.rows.item(index).name.replace(/\''/g, "'"),
            metadata: JSON.parse(
              result.rows.item(index).metadata.replace(/\''/g, "'"),
            ),
          };
          entries.push(entryObject);
        }
      });
    })
    .catch(err => {
      console.warn('DB: Error reading single entry ', err);
    });

  return entries;
};

const getChildrenEntriesForParent = async (
  db: SQLiteDatabase,
  parentId: string,
) => {
  const query = `
  SELECT id, name, status, file_location
  FROM ${tableName.SingleItems}
  WHERE parent_id = ('${parentId}');`;

  let entries: [] = [];
  await db
    .executeSql(query)
    .then(results => {
      //console.log('DB: Successfully read children entries');
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          const entryObject = {
            id: result.rows.item(index).id,
            name: result.rows.item(index).name.replace(/\''/g, "'"),
            status: result.rows.item(index).status,
            fileLocation: result.rows.item(index).file_location,
          };
          entries.push(entryObject);
        }
      });
    })
    .catch(err => {
      console.warn('DB: Error reading children entries ', err);
    });

  return entries;
};

const deleteParentWithChildren = async (db: SQLiteDatabase, id: number) => {
  const queryParents = `
  DELETE FROM ${tableName.ParentItems} WHERE id = '${id}';`;

  const queryItems = `
  DELETE FROM ${tableName.ParentItems} WHERE parent_id = '${id}';`;

  await db
    .executeSql(queryItems)
    .then(res => {
      console.log('DB: Successfully deleted items entry ', res);
    })
    .catch(err => {
      console.warn('DB: Error deleting items entry ', err);
    });

  await db
    .executeSql(queryParents)
    .then(res => {
      console.log('DB: Successfully deleted parents entry ', res);
    })
    .catch(err => {
      console.warn('DB: Error deleting parents entry ', err);
    });
};

export const readFileLocationItem = async (
  db: SQLiteDatabase,
  itemId: string,
) => {
  const query = `
  SELECT file_location, status, image_location 
  FROM ${tableName.SingleItems} 
  WHERE id = ('${itemId}');`;

  let files: Array<Object> = [];
  await db
    .executeSql(query)
    .then(results => {
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          const entryObject = {
            id: itemId,
            fileLocation: result.rows.item(index).file_location,
            status: result.rows.item(index).status,
            imageLocation: result.rows.item(index).image_location,
          };
          files.push(entryObject);
        }
      });
    })
    .catch(err => {
      console.warn('DB: Error reading song file location ', err);
    });

  return files;
};

const writeKeyValueData = async (
  db: SQLiteDatabase,
  key: string,
  value: string,
) => {
  const query = `INSERT OR REPLACE INTO ${tableName.KeyValue}(key, value) 
   values ('${key}', '${JSON.stringify(value).replace(/\'/g, "''")}');`;

  await db
    .executeSql(query)
    .then(res => console.log('DB: Successfully saved key value data', res))
    .catch(err => console.warn('DB: Error saving key value data', err));
  return;
};

const readKeyValueData = async (db: SQLiteDatabase, key: string) => {
  const query = `SELECT * FROM ${tableName.KeyValue} WHERE key = ('${key}');`;
  let result;
  await db
    .executeSql(query)
    .then(results => {
      result = results[0].rows.item(0).value.replace(/\''/g, "'");
    })
    .catch(err => console.warn('DB: Error read key value data', err));
  return result;
};

const deleteAllRows = async (db: SQLiteDatabase) => {
  const queries: Array<string> = [
    `DELETE FROM ${tableName.CustomLists};`,
    `DELETE FROM ${tableName.KeyValue};`,
    `DELETE FROM ${tableName.ParentItems};`,
    `DELETE FROM ${tableName.SingleItems};`,
  ];

  queries.forEach(async query => {
    await db
      .executeSql(query)
      .then(() => {
        console.log('DB: Successfully executed: ', query);
      })
      .catch(err => console.warn('DB: Error read key value data', err));
  });
};

export {
  createParentItemEntries,
  createSingleItemEntries,
  createTables,
  deleteAllRows,
  deleteParentWithChildren,
  getChildrenEntriesForParent,
  getDBConnection,
  readKeyValueData,
  readSingleEntry,
  readSingleEntryId,
  updateSingleItemStatus,
  writeKeyValueData,
};
