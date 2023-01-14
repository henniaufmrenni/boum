import {useStore} from '@boum/hooks';
import {Session} from '@boum/types';

const useGetHome = (session: Session) => {
  const jellyfin = useStore.getState().jellyfinClient;

  const latest = jellyfin.getLatestAlbums(session);

  const favorites = jellyfin.getAllAlbums(
    session,
    0,
    'SortName',
    'Ascending',
    'IsFavorite',
    '',
  );

  const random = jellyfin.getAllAlbums(
    session,
    0,
    'Random',
    'Ascending',
    '',
    '',
  );

  const mutate = () => {
    latest.mutate();
    favorites.allAlbumsMutate();
    random.allAlbumsMutate();
  };

  const res = {
    latestAlbums: latest.data,
    latestAlbumsLoading: !latest.error && !latest.data,
    favoriteAlbums: favorites.allAlbumsData,
    favoriteAlbumsLoading: favorites.allAlbumsLoading,
    randomAlbums: random.allAlbumsData,
    randomAlbumsLoading: random.allAlbumsLoading,
    mutateGetHome: mutate,
  };
  return res;
};

export {useGetHome};
