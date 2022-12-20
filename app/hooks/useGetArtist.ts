import {useEffect, useState} from 'react';
import {Blurhash} from 'react-native-blurhash';

import {useStore} from '@boum/hooks';
import {Session} from '@boum/types';

const useGetArtist = (
  routeItem: object,
  routeItemId: string,
  session: Session,
) => {
  const jellyfin = useStore.getState().jellyfinClient;

  const [artistInfo, setArtistInfo] = useState(false);
  const [averageColorRgb, setAverageColorRgb] = useState('');

  const {artistItems} = jellyfin.getArtistItems(session, routeItemId);
  const {appearsOnItems} = jellyfin.getAppearsOn(session, routeItemId);
  const {similarArtists} = jellyfin.getSimilarArtists(session, routeItemId);

  useEffect(() => {
    async function setState() {}
    if (routeItem !== undefined) {
      setArtistInfo(routeItem);
    } else {
      const {data} = jellyfin.getSingleItem(session, routeItemId);
      data().then(data => setArtistInfo(data));
    }
    setState();
  }, [routeItemId, jellyfin, routeItem, session]);

  useEffect(() => {
    function setBackGround() {
      if (artistInfo) {
        if (artistInfo.ImageBlurHashes.Primary !== undefined) {
          const averageColor = Blurhash.getAverageColor(
            artistInfo.ImageBlurHashes.Primary[
              Object.keys(artistInfo.ImageBlurHashes.Primary)[0]
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
  }, [artistInfo]);

  return {
    artistInfo,
    averageColorRgb,
    artistItems,
    similarArtists,
    appearsOnItems,
  };
};

export {useGetArtist};
