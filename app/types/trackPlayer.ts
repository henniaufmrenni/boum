import {Track} from 'react-native-track-player';

interface TrackBoum extends Track {
  id: string;
  artistId: string;
  albumId: string;
  isFavorite: boolean;
  headers: Headers;
}

interface PlayerItem {
  album: string;
  albumId: string;
  artist: string;
  artistId: string;
  artwork: string;
  date: string;
  duration: string;
  headers: Headers;
  id: string;
  title: string;
  url: string;
}

export type {TrackBoum, PlayerItem};
