/* eslint-disable quotes */
/* eslint-disable no-useless-escape */

import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

import {
  CustomHomeListItem,
  DownloadStatus,
  MediaItem,
  SuccessMessage,
  TableName,
  UnfinishedDownload,
} from '@boum/types';

class DbService {
  _ = SQLite.enablePromise(true);

  public getDBConnection = async () => {
    return SQLite.openDatabase({name: 'boum.db', location: 'default'});
  };

  public createTables = async (db: SQLiteDatabase) => {
    // prettier-ignore
    const createParentItemsTable = `
    CREATE TABLE IF NOT EXISTS ${TableName.ParentItems}(
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
    const createChildrenTable = `
    CREATE TABLE IF NOT EXISTS ${TableName.SingleItems}(
      id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL UNIQUE,
      file_location TEXT NOT NULL,
      image_location TEXT NOT NULL,
      metadata TEXT NOT NULL,
      status TEXT NOT NULL, 
      parent_id TEXT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (parent_id) 
         REFERENCES ${TableName.ParentItems} (id) 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
   );`;

    await db
      .executeSql(createChildrenTable)
      .then(() => console.log('Successfully created single items table.'))
      .catch(() => console.log('Error creating single items table.'));

    const createKeyValueTable = `
      CREATE TABLE IF NOT EXISTS ${TableName.KeyValue}(
        key TEXT NOT NULL UNIQUE,
        value TEXT
      );`;

    await db
      .executeSql(createKeyValueTable)
      .then(() => console.log('Successfully created key value table.'))
      .catch(err => console.log('Error creating key value table: ', err));

    // prettier-ignore
    const createCustomListsTable = `
    CREATE TABLE IF NOT EXISTS ${TableName.CustomLists}(
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

  public createSingleItemEntries = async (
    db: SQLiteDatabase,
    albumItem: MediaItem,
    fileLocation: string,
    parentId: string,
    imageLocation: string,
  ) => {
    // prettier-ignore
    const insertQuery =
    `INSERT OR REPLACE INTO ${TableName.SingleItems}(id, name, file_location, image_location, metadata, status, parent_id) 
     values ('${albumItem.Id}', '${albumItem.Name.replace(/\'/g,"''")}', '${fileLocation.replace(/\'/g,"''")
    }', '${imageLocation.replace(/\'/g,"''")}', '${JSON.stringify(albumItem).replace(/\'/g,"''")}', 'started', '${parentId}')`;

    await db
      .executeSql(insertQuery)
      .then(() => console.log('DB: Successfully saved single item data'))
      .catch(err => console.warn('DB: Error saving single item data: ', err));
    return;
  };

  public createParentItemEntries = async (
    db: SQLiteDatabase,
    parentItem: MediaItem,
  ) => {
    // prettier-ignore
    const insertQuery =
    `INSERT OR REPLACE INTO ${TableName.ParentItems}(id, name, metadata) 
     values ('${parentItem.Id}', '${parentItem.Name.replace(/\'/g,"''")}','${JSON.stringify(parentItem).replace(/\'/g,"''")}')`;

    await db
      .executeSql(insertQuery)
      .then(() => console.log('DB: Successfully saved parent data'))
      .catch(err => console.warn('DB: Error saving parent data ', err));
    return;
  };

  public updateSingleItemStatus = async (
    db: SQLiteDatabase,
    itemId: string,
    status: DownloadStatus,
    fileLocation: string,
  ) => {
    // prettier-ignore
    const insertQuery =
    `UPDATE ${TableName.SingleItems}
     SET status = '${status}', file_location = '${fileLocation}' 
     WHERE id = '${itemId}'; `;

    await db
      .executeSql(insertQuery)
      .then(() => console.log('DB: Successfully updated status'))
      .catch(err => console.warn('DB: Error updating status', err));
    return;
  };

  public readSingleEntry = async (
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

  public readSingleEntryId = async (
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

  public readParentEntries = async (db: SQLiteDatabase, table: TableName) => {
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

  public getChildrenEntriesForParent = async (
    db: SQLiteDatabase,
    parentId: string,
  ) => {
    const query = `
    SELECT id, name, status, file_location
    FROM ${TableName.SingleItems}
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

  public deleteParentWithChildren = async (db: SQLiteDatabase, id: number) => {
    const queryParents = `
    DELETE FROM ${TableName.ParentItems} WHERE id = '${id}';`;

    const queryItems = `
    DELETE FROM ${TableName.SingleItems} WHERE parent_id = '${id}';`;

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

  public readFileLocationItem = async (db: SQLiteDatabase, itemId: string) => {
    const query = `
    SELECT file_location, status, image_location 
    FROM ${TableName.SingleItems} 
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

  public readUnfinishedDownloads = async (db: SQLiteDatabase) => {
    const query = `
    SELECT * 
    FROM ${TableName.ParentItems} 
    WHERE status in ('failure', '')
    INNER JOIN ${TableName.SingleItems} ON ${TableName.SingleItems}.album_id=${TableName.ParentItems}.id; ;`;

    let files: Array<UnfinishedDownload> = [];
    await db
      .executeSql(query)
      .then(results => {
        results.forEach(result => {
          for (let index = 0; index < result.rows.length; index++) {
            console.log(result.rows.item(index));
            const entryObject = {
              id: result.rows.item(index).id,
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

  public writeKeyValueData = async (
    db: SQLiteDatabase,
    key: string,
    value: string,
  ) => {
    const query = `INSERT OR REPLACE INTO ${TableName.KeyValue}(key, value) 
     values ('${key}', '${JSON.stringify(value).replace(/\'/g, "''")}');`;

    await db
      .executeSql(query)
      .then(res => console.log('DB: Successfully saved key value data', res))
      .catch(err => console.warn('DB: Error saving key value data', err));
    return;
  };

  public readKeyValueData = async (db: SQLiteDatabase, key: string) => {
    const query = `SELECT * FROM ${TableName.KeyValue} WHERE key = ('${key}');`;
    let result;
    await db
      .executeSql(query)
      .then(results => {
        result = results[0].rows.item(0).value.replace(/\''/g, "'");
      })
      .catch(err => console.warn('DB: Error read key value data', err));
    return result;
  };

  public deleteAllRows = async (db: SQLiteDatabase) => {
    const queries: Array<string> = [
      `DELETE FROM ${TableName.CustomLists};`,
      `DELETE FROM ${TableName.KeyValue};`,
      `DELETE FROM ${TableName.ParentItems};`,
      `DELETE FROM ${TableName.SingleItems};`,
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

  public saveCustomList = async ({
    title,
    sortOrder,
    sortBy,
    filters,
    searchQuery,
    genreId,
  }: CustomHomeListItem) => {
    const db = await this.getDBConnection();
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

  public getCustomLists = async () => {
    const db = await this.getDBConnection();

    const query = `
    SELECT * 
    FROM custom_lists;`;

    let entries: Array<CustomHomeListItem> = [];

    await db
      .executeSql(query)
      .then(results => {
        console.log('DB: Successfully read single entry');
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

  public deleteCustomList = async (title: string): Promise<SuccessMessage> => {
    const db = await this.getDBConnection();
    let result: SuccessMessage = 'not triggered';
    // prettier-ignore
    const query = 
      `DELETE FROM custom_lists WHERE title = '${title.replace(/\'/g,"''")}';`;

    await db
      .executeSql(query)
      .then(() => {
        console.log('DB: Successfully custom list data');
        result = 'success';
      })
      .catch(err => {
        console.warn('DB: Error saving custom list data ', err);
        result = 'fail';
      });

    return result;
  };
}

export {DbService};
