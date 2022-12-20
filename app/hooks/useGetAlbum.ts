import {useEffect, useState} from 'react';
import {Blurhash} from 'react-native-blurhash';

import {useCheckParentIsDownloaded, useStore} from '@boum/hooks';
import {Session} from '@boum/types';

const useGetAlbum = (
  routeItem: object,
  routeItemId: string,
  session: Session,
) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const [albumInfo, setAlbumInfo] = useState(false);
  const [averageColorRgb, setAverageColorRgb] = useState('');

  const {albumItems} = jellyfin.getAlbumItems(session, routeItemId);
  const {similarAlbums} = jellyfin.getSimilarItems(session, routeItemId);

  const isDownloaded = useCheckParentIsDownloaded(routeItemId);

  useEffect(() => {
    async function setState() {}
    if (routeItem) {
      setAlbumInfo(routeItem);
    } else {
      const {data} = jellyfin.getSingleItem(session, routeItemId);
      data().then(data => setAlbumInfo(data));
    }
    setState();
  }, [routeItemId, jellyfin, routeItem, session]);

  useEffect(() => {
    function setBackGround() {
      if (albumInfo) {
        if (albumInfo?.ImageBlurHashes?.Primary !== undefined) {
          const averageColor = Blurhash.getAverageColor(
            albumInfo?.ImageBlurHashes?.Primary[
              Object.keys(albumInfo.ImageBlurHashes.Primary)[0]
            ],
          );
          setAverageColorRgb(
            `rgb(${averageColor?.r}, ${averageColor?.g}, ${averageColor?.b} )`,
          );
        } else {
          setAverageColorRgb('rgb(168, 44, 69)');
        }
      }
    }
    setBackGround();
  }, [albumInfo]);

  return {
    albumInfo,
    isDownloaded,
    averageColorRgb,
    albumItems,
    similarAlbums,
  };
};

export {useGetAlbum};
