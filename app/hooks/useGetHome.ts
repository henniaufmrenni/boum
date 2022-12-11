import {useStore} from '@boum/hooks';
import {Session} from '@boum/types';

const useGetHome = (session: Session) => {
  const jellyfin = useStore.getState().jellyfinClient;

  const {latestAlbums, latestAlbumsLoading, latestAlbumsMutate} =
    jellyfin.getLatestAlbums(session);

  const {
    frequentlyPlayedAlbums,
    frequentlyPlayedAlbumsLoading,
    frequentlyPlayedAlbumsMutate,
  } = jellyfin.getFrequentlyPlayedAlbums(session);

  const {
    recentlyPlayedAlbums,
    recentlyPlayedAlbumsLoading,
    recentlyPlayedAlbumsMutate,
  } = jellyfin.getRecentlyPlayedAlbums(session);

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
    recentlyPlayedAlbumsMutate();
    frequentlyPlayedAlbumsMutate();
    latestAlbumsMutate();
    favorites.allAlbumsMutate();
    random.allAlbumsMutate();
  };

  const res = {
    latestAlbums,
    latestAlbumsLoading,
    frequentlyPlayedAlbums,
    frequentlyPlayedAlbumsLoading,
    recentlyPlayedAlbums,
    recentlyPlayedAlbumsLoading,
    favoriteAlbums: favorites.allAlbumsData,
    favoriteAlbumsLoading: favorites.allAlbumsLoading,
    randomAlbums: random.allAlbumsData,
    randomAlbumsLoading: random.allAlbumsLoading,
    mutateGetHome: mutate,
  };
  return res;
};

export {useGetHome};
