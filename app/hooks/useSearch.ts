import {versionBoum} from '@boum/constants';
import {Session} from '@boum/types';

import {useEffect, useRef, useState} from 'react';

const useCancelableSearch = (session: Session, query: string) => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const controllerRef = useRef<AbortController | null>();

  useEffect(() => {
    const header = `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`;
    const fetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Emby-Authorization': header,
      },
      signal: controllerRef.current?.signal,
    };
    async function search() {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        const resAlbums = await fetch(
          `${session.hostname}/Users/${session.userId}/Items?searchTerm=${query}&Limit=6&Fields=PrimaryImageAspectRatio,BasicSyncInfo,Genres,MediaSourceCount&Recursive=true&EnableTotalRecordCount=false&ImageTypeLimit=1&IncludePeople=false&IncludeMedia=true&IncludeGenres=false&IncludeStudios=false&IncludeArtists=false&IncludeItemTypes=MusicAlbum`,
          fetchOptions,
        );
        const albums = await resAlbums.json();
        setAlbums(albums);

        const resArtists = await fetch(
          `${session.hostname}/Artists?searchTerm=${query}&Limit=6&Fields=PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount&Recursive=true&EnableTotalRecordCount=false&ImageTypeLimit=1&IncludePeople=false&IncludeMedia=false&IncludeGenres=false&IncludeStudios=false&IncludeArtists=true&userId=${session.userId}`,
          fetchOptions,
        );
        const artists = await resArtists.json();
        setArtists(artists);

        const resSongs = await fetch(
          `${session.hostname}/Users/${session.userId}/Items?searchTerm=${query}&Limit=6&Fields=PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount&Recursive=true&EnableTotalRecordCount=false&ImageTypeLimit=1&IncludePeople=false&IncludeMedia=true&IncludeGenres=false&IncludeStudios=false&IncludeArtists=false&IncludeItemTypes=Audio`,
          fetchOptions,
        );
        const songs = await resSongs.json();
        setSongs(songs);

        controllerRef.current = null;
      } catch (e) {}
    }

    if (query.length >= 2) {
      search();
    }
  }, [query, session]);

  return {albums, artists, songs};
};

export {useCancelableSearch};
