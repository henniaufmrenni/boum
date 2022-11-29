import {getDBConnection} from '@boum/lib/db/service';

import {CustomHomeListItem, SuccessMessage} from '@boum/types';

type CreateOrUpdateMovieDataProps = {
  db: SQLiteDatabase;
  item: VideoMediaItem;
  playbackInfo: PlaybackInfo;
  file_location: string;
  image_location: string;
  subtitles: string;
  status: string;
};

const createMovieEntry = async ({
  db,
  item,
  playbackInfo,
  file_location,
  image_location,
  subtitles,
  status,
}: CreateOrUpdateMovieDataProps) => {
  let result;
  // prettier-ignore
  const insertQuery = 
    `INSERT OR REPLACE INTO movies_items(id, metadata, playback_info, image_location, subtitles, status) 
     values ('${item.Id}', '${item}','${playbackInfo}','${image_location}','${subtitles}','${status}')`;

  await db
    .executeSql(insertQuery)
    .then(res => {
      console.log('DB: Successfully custom list data');
      result = res;
    })
    .catch(err => console.warn('DB: Error saving custom list data ', err));

  return result;
};

const updateMovieStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const db = await getDBConnection();
  let result;
  // prettier-ignore
  const insertQuery = 
  `UPDATE movies_items
   SET status = ('${status}')
   WHERE id = '${itemId}'; `;

  await db
    .executeSql(insertQuery)
    .catch(err => console.warn('DB: Error saving custom list data ', err));

  return result;
};

/*
    id TEXT NOT NULL UNIQUE,
    metadata TEXT NOT NULL,
    playback_info TEXT NOT NULL,
    file_location TEXT NOT NULL,
    image_location TEXT NOT NULL,
    subtitles TEXT NOT NULL
    status TEXT NOT NULL
*/

const readMovieData = async () => {
  const db = await getDBConnection();

  const query = `
  SELECT * 
  FROM movies_items;`;

  let entries: Array<CustomHomeListItem> = [];

  await db
    .executeSql(query)
    .then(results => {
      //console.log('DB: Successfully read single entry');
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          const entryObject: CustomHomeListItem = {
            id: result.rows.item(index).id,
            metadata: result.rows.item(index).metadata,
            playbackInfo: result.rows.item(index).playback_info,
            fileLocation: result.rows.item(index).file_location,
            imageLocation: result.rows.item(index).image_location,
            subtitles: result.rows.item(index).subtitles,
            status: result.rows.item(index).status,
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

const deleteMovieEntry = async (id: string): Promise<SuccessMessage> => {
  const db = await getDBConnection();
  let result: SuccessMessage = 'not triggered';
  // prettier-ignore
  const query = 
    `DELETE FROM custom_lists WHERE id = '${id}';`;

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

export {deleteMovieEntry, readMovieData, updateMovieStatus, createMovieEntry};
