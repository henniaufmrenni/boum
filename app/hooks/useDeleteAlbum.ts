import RNFS from 'react-native-fs';

import {deleteParentWithChildren, getDBConnection} from '@boum/lib/db/service';

const useDeleteAlbum = async (album: object) => {
  const db = await getDBConnection();

  RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${album.name}`).then(res =>
    res.forEach(element => {
      RNFS.unlink(element.path)
        .then(() => {
          console.log('DELETED', element.path);
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch(err => {
          console.log(err.message);
        });
    }),
  );

  await deleteParentWithChildren(db, album.metadata.Id);
};

export {useDeleteAlbum};
