import RNFS from 'react-native-fs';

import {
  deleteParentWithChildren,
  getChildrenEntriesForParent,
  getDBConnection,
} from '@boum/lib/db/service';

const useDeleteAlbum = async (album: object) => {
  const db = await getDBConnection();

  album.children.forEach(child => {
    RNFS.unlink(child.fileLocation)
      .then(() => {
        console.log('DELETED', child.fileLocation);
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        console.log(err.message);
      });
  }),
    await deleteParentWithChildren(db, album.metadata.Id);
};

export {useDeleteAlbum};
