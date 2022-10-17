import useSWR from 'swr';

import {versionBoum} from '@boum/constants';
import {favoriteAction, Filter, Session, SortBy, SortOrder} from '@boum/types';

class jellyfinClient {
  private fetcher = (url: string, headers: string) =>
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Emby-Authorization': headers,
      },
    }).then(res => res.json());

  private authHeaders = (session: Session) => {
    return `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`;
  };

  private optionsSWR = {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnReconnect: false,
    dedupingInterval: 1000,
  };

  public getLatestAlbums = (session: Session) => {
    const query = `${session.hostname}/Users/${session.userId}/Items/Latest?IncludeItemTypes=Audio&Limit=24&Fields=ItemCounts,PrimaryImageAspectRatio,Genres,MediaSourceCount&ImageTypeLimit=1&EnableImageTypes=Primary&EnableTotalRecordCount=true&enableImages=true`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );
    return {
      latestAlbums: data,
      latestAlbumsLoading: !error && !data,
      latestAlbumsError: error,
      latestAlbumsMutate: mutate,
    };
  };

  public getRecentlyPlayedAlbums = (session: Session) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?SortBy=DatePlayed&SortOrder=Ascending&IncludeItemTypes=MusicAlbum&Recursive=true&Fields=PrimaryImageAspectRatio,SortName,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary&StartIndex=0&Limit=10`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      recentlyPlayedAlbums: data,
      recentlyPlayedAlbumsLoading: !error && !data,
      isError: error,
      recentlyPlayedAlbumsMutate: mutate,
    };
  };

  public getFrequentlyPlayedAlbums = (session: Session) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?SortBy=PlayCount&SortOrder=Ascending&IncludeItemTypes=MusicAlbum&Recursive=true&Fields=PrimaryImageAspectRatio,SortName,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary&StartIndex=0&Limit=10`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );
    return {
      frequentlyPlayedAlbums: data,
      frequentlyPlayedAlbumsLoading: !error && !data,
      frequentlyPlayedAlbumsError: error,
      frequentlyPlayedAlbumsMutate: mutate,
    };
  };
  public getAllAlbums = (
    session: Session,
    index: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    filter: Filter,
    searchQuery: string,
  ) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?searchTerm=${searchQuery}&SortBy=${sortBy}&SortOrder=${sortOrder}&IncludeItemTypes=MusicAlbum&Recursive=true&Fields=PrimaryImageAspectRatio,Genres,SortName,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Thumb&StartIndex=${index}&Limit=40&Filters=${filter}`;
    const headers = this.authHeaders(session);
    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      allAlbumsData: data,
      allAlbumsLoading: !error && !data,
      allAlbumsError: error,
      allAlbumsMutate: mutate,
    };
  };

  public getGenreItems = (
    session: Session,
    index: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    genreId: string,
    searchQuery: string,
  ) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?searchTerm=${searchQuery}&SortBy=${sortBy}&SortOrder=${sortOrder}&IncludeItemTypes=MusicAlbum&Recursive=true&Fields=PrimaryImageAspectRatio,SortName,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Thumb&StartIndex=${index}&Limit=40&GenreIds=${genreId}`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      genreAlbumsData: data,
      genreAlbumsLoading: !error && !data,
      genreAlbumsError: error,
      genreAlbumsMutate: mutate,
    };
  };

  // Needs to be a simple fetch and not SWR since it's otherwise an invalid hooks call
  public getSingleItem = (session: Session, id: string) => {
    const query = `${session.hostname}/Users/${session.userId}/Items/${id}?Fields=PrimaryImageAspectRatio,Genres,SortName,BasicSyncInfo`;
    const headers = this.authHeaders(session);

    const data = async () => {
      return await fetch(query, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Emby-Authorization': headers,
        },
      }).then(res => res.json());
    };

    return {
      data: data,
    };
  };

  public getAlbumItems = (session: Session, id: string) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?ParentId=${id}&Fields=ItemCounts,PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount&SortBy=ParentIndexNumber,IndexNumber,SortName
  `;
    const headers = this.authHeaders(session);

    const {
      data: results,
      error,
      mutate,
    } = useSWR([query, headers], this.fetcher, this.optionsSWR);

    return {
      albumItems: results,
      albumItemsLoading: !error && !results,
      albumItemsError: error,
      albumItemsMutate: mutate,
    };
  };

  public getSimilarArtists = (session: Session, artistId: string) => {
    const query = `${session.hostname}/Artists/${artistId}/Similar?limit=6`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      similarArtists: data,
      similarArtistsLoading: !error && !data,
      similarArtistsError: error,
      similarArtistsMutate: mutate,
    };
  };

  public getMediaFolders = (session: Session) => {
    const query = `${session.hostname}/Library/MediaFolders`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      mediafolders: data,
      mediafoldersError: error,
      mediafoldersMutate: mutate,
    };
  };

  public getAllGenres = (session: Session) => {
    const query = `${session.hostname}/Genres?SortBy=SortName&SortOrder=Ascending&Recursive=true&Fields=PrimaryImageAspectRatio,ItemCounts&StartIndex=0&userId=${session.userId}`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      allGenres: data,
      allGenresLoading: !error && !data,
      allGenresError: error,
      allGenresMutate: mutate,
    };
  };

  public getAllArtists = (
    session: Session,
    startIndex: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    searchQuery: string,
  ) => {
    const query = `${session.hostname}/Artists?searchTerm=${searchQuery}&SortBy=${sortBy}&SortOrder=${sortOrder}&Recursive=true&Fields=PrimaryImageAspectRatio,SortName,BasicSyncInfo&StartIndex=${startIndex}&ImageTypeLimit=1&EnableImageTypes=Primary&Limit=40`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      allArtistsData: data,
      allArtistsLoading: !error && !data,
      allArtistsError: error,
      allArtistsMutate: mutate,
    };
  };

  public getArtistItems = (session: Session, artistId: string) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?SortOrder=Descending&IncludeItemTypes=MusicAlbum&Recursive=true&Fields=AudioInfo,PrimaryImageAspectRatio,Genres,BasicSyncInfo&Limit=300&StartIndex=0&CollapseBoxSetItems=false&AlbumArtistIds=${artistId}&SortBy=PremiereDate,ProductionYear,Sortname`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      artistItems: data,
      artistItemsLoading: !error && !data,
      artistItemsError: error,
      artistItemsMutate: mutate,
    };
  };

  public getAppearsOn = (session: Session, artistId: string) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?IncludeItemTypes=MusicAlbum&Recursive=true&SortBy=PremiereDate,ProductionYear,Genres,SortName&SortOrder=Descending&ContributingArtistIds=${artistId}`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      appearsOnItems: data,
      appearsOnItemsLoading: !error && !data,
      appearsOnItemsError: error,
      appearsOnItemsMutate: mutate,
    };
  };

  public getSimilarAlbums = (session: Session, artistId: string) => {
    const query = `${session.hostname}/Albums/${artistId}/Similar?limit=6&Fields=Genres,`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      similarAlbums: data,
      similarAlbumsLoading: !error && !data,
      similarAlbumsError: error,
      similarAlbumsMutate: mutate,
    };
  };

  public postFavorite = async (
    session: Session,
    id: string,
    action: favoriteAction,
  ) => {
    const query = `${session.hostname}/Users/${session.userId}/FavoriteItems/${id}`;

    const headers = this.authHeaders(session);

    const res = await fetch(query, {
      method: action,
      headers: {
        'X-Emby-Authorization': headers,
      },
    });
    return res.status;
  };

  public getLyrics = async (session: Session, id: string) => {
    const query = `${session.hostname}/Items/${id}/Lyrics`;
    const headers = this.authHeaders(session);

    const res = await fetch(query, {
      method: 'GET',
      headers: {
        'X-Emby-Authorization': headers,
      },
    });
    return res;
  };

  public getAllPlaylists = (
    session: Session,
    index: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    filter: Filter,
    searchQuery: string,
  ) => {
    const query = `${session.hostname}/Users/${session.userId}/Items?searchTerm=${searchQuery}&SortBy=${sortBy}&SortOrder=${sortOrder}&IncludeItemTypes=Playlist&Recursive=true&Fields=PrimaryImageAspectRatio,Genres,SortName,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Thumb&StartIndex=${index}&Limit=40`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      allPlaylistsData: data,
      allPlaylistsLoading: !error && !data,
      allPlaylistsError: error,
      allPlaylistsMutate: mutate,
    };
  };

  public addOrRemoveSongPlaylist = async (
    session: Session,
    songId: string,
    playlistId: string,
    action: favoriteAction,
  ) => {
    const query = `${session.hostname}/Playlists/${playlistId}/Items?Ids=${songId}&userId=${session.userId}`;

    const headers = this.authHeaders(session);

    const res = await fetch(query, {
      method: action,
      headers: {
        'X-Emby-Authorization': headers,
      },
    });

    return res.status;
  };
}

export {jellyfinClient};
