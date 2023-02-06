import useSWR from 'swr';

import {MICROSECONDS_IN_SECONDS, versionBoum} from '@boum/constants';
import {
  FavoriteAction,
  Filters,
  ItemTypes,
  PlaybackInfo,
  PlayMethod,
  ProgressUpdateBody,
  Session,
  SortBy,
  SortOrder,
  ProgressUpdateType,
  VideoMediaItem,
  HttpMethod,
} from '@boum/types';

import {requestPlaybackInfoBody} from '@boum/lib/api';
import {OnProgressData} from 'react-native-video';

/**
 * API client for the Jellyfin server
 */
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
    return `MediaBrowser Client="boum", Device="boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`;
  };

  private optionsSWR = {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnReconnect: false,
    dedupingInterval: 1000,
  };

  /**
   *
   * @param session
   * @returns
   */
  public getLatestAlbums = (session: Session) => {
    const query = `${session.hostname}/Users/${session.userId}/Items/Latest?IncludeItemTypes=Audio&Limit=24&Fields=ItemCounts,PrimaryImageAspectRatio,Genres,MediaSourceCount&ImageTypeLimit=1&EnableImageTypes=Primary&EnableTotalRecordCount=true&enableImages=true`;
    const headers = this.authHeaders(session);

    const latestAlbums = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );
    return latestAlbums;
  };

  /**
   *
   * @param session
   * @returns
   */
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

  /**
   *
   * @param session
   * @returns
   */
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

  /**
   *
   * @param session
   * @param index
   * @param sortBy
   * @param sortOrder
   * @param filter
   * @param searchQuery
   * @param genreId
   * @param itemTypes
   * @returns
   */
  public getAllAlbums = (
    session: Session,
    index: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    filter: Filters,
    searchQuery: string,
    genreId?: string,
    itemTypes?: ItemTypes,
  ) => {
    const query = `${session.hostname}/Users/${
      session.userId
    }/Items?searchTerm=${searchQuery}&SortBy=${sortBy}&SortOrder=${sortOrder}&IncludeItemTypes=${
      itemTypes ? itemTypes : 'MusicAlbum'
    }&Recursive=true&Fields=PrimaryImageAspectRatio,Genres,SortName,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Thumb&StartIndex=${index}&Limit=40&Filters=${filter}${
      genreId ? `&GenreIds=${genreId}` : ''
    }`;

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

  /**
   *
   * @param session
   * @param id
   * @returns
   */
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

  /**
   *
   * @param session
   * @param id
   * @returns
   */
  public getSingleItemSwr = (session: Session, id: string) => {
    const query = `${session.hostname}/Users/${session.userId}/Items/${id}?Fields=PrimaryImageAspectRatio,Genres,SortName,BasicSyncInfo`;
    const headers = this.authHeaders(session);

    const {data, error, mutate} = useSWR(
      [query, headers],
      this.fetcher,
      this.optionsSWR,
    );

    return {
      data,
      error,
      mutate,
    };
  };

  /**
   *
   * @param session
   * @param id
   * @returns
   */
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

  /**
   *
   * @param session
   * @param artistId
   * @returns
   */
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

  /**
   *
   * @param session
   * @returns
   */
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

  /**
   *
   * @param session
   * @returns
   */
  public getAllGenres = async (session: Session) => {
    let query: string;
    const headers = this.authHeaders(session);

    // We need to first get all libraries and filter the music libraries since we need to pass
    // the library Id as ParentId to the /Genres query, otherwise all genres will be retrieved,
    // including movie etc. genres.
    const queryLibraries = `${session.hostname}/Users/${session.userId}/Views`;
    const libraries = await fetch(queryLibraries, {
      headers: {
        'X-Emby-Authorization': headers,
      },
    });

    const librariesJson = await libraries.json();

    const musicLibrary = librariesJson.Items.filter(
      library => library.CollectionType === 'music',
    );

    if (musicLibrary !== undefined) {
      query = `${session.hostname}/Genres?SortBy=SortName&SortOrder=Ascending&Recursive=true&Fields=PrimaryImageAspectRatio,ItemCounts&StartIndex=0&userId=${session.userId}&ParentId=${musicLibrary[0].Id}`;
    } else {
      return undefined;
    }

    const genres = await fetch(query, {
      headers: {
        'X-Emby-Authorization': headers,
      },
    });

    const genresJson = genres.json();

    return genresJson;
  };

  /**
   *
   * @param session
   * @param startIndex
   * @param sortBy
   * @param sortOrder
   * @param searchQuery
   * @returns
   */
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

  /**
   *
   * @param session
   * @param artistId
   * @returns
   */
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

  /**
   *
   * @param session
   * @param artistId
   * @returns
   */
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

  /**
   *
   * @param session
   * @param artistId
   * @returns
   */
  public getSimilarItems = (session: Session, artistId: string) => {
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

  /**
   *
   * @param session
   * @param id
   * @param action
   * @returns
   */
  public postFavorite = async (
    session: Session,
    id: string,
    action: HttpMethod,
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

  /**
   *
   * @param session
   * @param id
   * @returns
   */
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

  /**
   *
   * @param session
   * @param index
   * @param sortBy
   * @param sortOrder
   * @param filter
   * @param searchQuery
   * @returns
   */
  public getAllPlaylists = (
    session: Session,
    index: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    filter: Filters,
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

  /**
   *
   * @param session
   * @param songId
   * @param playlistId
   * @param action
   * @returns
   */
  public addOrRemoveSongPlaylist = async (
    session: Session,
    songId: string,
    playlistId: string,
    action: FavoriteAction,
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

  /**
   *
   * @param session
   * @param index
   * @param sortBy
   * @param sortOrder
   * @returns
   */
  public getAllBooks = async (
    session: Session,
    index: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
  ) => {
    const headers = this.authHeaders(session);
    let allBooksData;
    let allBooksLoading: boolean = true;
    let allBooksError: boolean = false;

    // We need to get a list of all libraries, so that we get the parentId of the
    // book folder.
    const queryViews = `${session.hostname}/Library/VirtualFolders`;
    const resLibraries = await fetch(queryViews, {
      method: 'GET',
      headers: {
        'X-Emby-Authorization': headers,
      },
    });

    await resLibraries.json().then(async (libraries: Array<object>) => {
      const bookLibrary = libraries.filter(
        library => library.CollectionType === 'books',
      )[0].ItemId;
      const booksQuery = `${session.hostname}/Users/${session.userId}/Items?StartIndex=${index}&Limit=40&Fields=PrimaryImageAspectRatio,SortName,Path,SongCount,ChildCount,MediaSourceCount,PrimaryImageAspectRatio&ImageTypeLimit=1&EnableImageTypes=Primary&ParentId=${bookLibrary}&SortBy=IsFolder,${sortBy}&SortOrder=${sortOrder}`;

      const resBooks = await fetch(booksQuery, {
        method: 'GET',
        headers: {
          'X-Emby-Authorization': headers,
        },
      });
      await resBooks.json().then(books => {
        allBooksData = books;
        allBooksLoading = false;
      });
    });

    return {
      allBooksData,
      allBooksLoading,
      allBooksError,
    };
  };

  /**
   *
   * @param session
   * @param item
   * @param hevcSupported
   * @param maxStreamingBitrate
   * @param startTimeTicks
   * @returns
   */
  public getPlaybackInfo = async (
    session: Session,
    item: VideoMediaItem,
    hevcSupported: boolean,
    maxStreamingBitrate?: number,
    startTimeTicks?: number,
  ): Promise<false | PlaybackInfo> => {
    const headers = this.authHeaders(session);
    const query = `${session.hostname}/Items/${item.Id}/PlaybackInfo?UserId=${
      session.userId
    }&StartTimeTicks=${
      startTimeTicks ? ~~startTimeTicks : 0
    }&IsPlayback=true&AutoOpenLiveStream=true&MaxStreamingBitrate=${
      maxStreamingBitrate ? maxStreamingBitrate : 120000000
    }`;

    const res = await fetch(query, {
      method: 'POST',
      headers: {
        'X-Emby-Authorization': headers,
        'Content-Type': 'application/json',
      },
      body: requestPlaybackInfoBody(hevcSupported),
    });

    if (res.ok) {
      return res.json();
    } else {
      return false;
    }
  };

  /**
   *
   * @param session
   * @param onProgressData
   * @param paused
   * @param playSessionId
   * @param playMethod
   * @param maxStreamingBitrate
   * @param mediaSourceId
   * @param progressUpdateType
   */
  public postProgressUpdate = async (
    session: Session,
    onProgressData: OnProgressData,
    paused: boolean,
    playSessionId: string,
    playMethod: PlayMethod,
    maxStreamingBitrate: number,
    mediaSourceId: string,
    progressUpdateType: ProgressUpdateType,
  ) => {
    const headers = this.authHeaders(session);
    const query = `${session.hostname}/Sessions/Playing${
      progressUpdateType === 'Update'
        ? '/Progress'
        : progressUpdateType === 'Stop'
        ? '/Stopped'
        : ''
    }`;

    const requestBody: ProgressUpdateBody = {
      VolumeLevel: 100,
      IsMuted: false,
      IsPaused: paused,
      RepeatMode: 'RepeatNone',
      ShuffleMode: 'Sorted',
      MaxStreamingBitrate: maxStreamingBitrate,
      PositionTicks: onProgressData.currentTime * MICROSECONDS_IN_SECONDS,
      PlaybackRate: 1,
      SubtitleStreamIndex: 1,
      AudioStreamIndex: 1,
      BufferedRanges: [
        {
          start: onProgressData.currentTime * MICROSECONDS_IN_SECONDS,
          end: (onProgressData.currentTime + 10) * MICROSECONDS_IN_SECONDS,
        },
      ],
      NowPlayingQueue: [{Id: mediaSourceId, PlaylistItemId: 'playlistItem0'}],
      PlayMethod: playMethod,
      PlaySessionId: playSessionId,
      PlaylistItemId: 'playlistItem0',
      MediaSourceId: mediaSourceId,
      CanSeek: true,
      ItemId: mediaSourceId,
      EventName: progressUpdateType === 'Update' ? 'timeupdate' : '',
    };

    await fetch(query, {
      method: 'POST',
      headers: {
        'X-Emby-Authorization': headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  };
}

export {jellyfinClient};
