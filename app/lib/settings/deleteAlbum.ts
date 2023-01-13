import RNFS from 'react-native-fs';

import {DbService} from '@boum/lib/db/Service';

const deleteAlbum = async (album: object, dbService: DbService) => {
  const db = await dbService.getDBConnection();

  album.children.forEach(child => {
    RNFS.unlink(child.fileLocation)
      .then(() => {
        console.log('DELETED', child.fileLocation);
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        console.log(err.message);
      });
  });
  await dbService.deleteParentWithChildren(db, album.metadata.Id);
};

export {deleteAlbum};
