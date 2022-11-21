import {Track} from 'react-native-track-player';

type UserData = {
  PlaybackPositionTicks: number;
  PlayCount: number;
  IsFavorite: boolean;
  Played: boolean;
  Key: string;
};

type NameId = {
  Name: string;
  Id: string;
};

interface MediaItem {
  Album: string;
  AlbumId: string;
  Name: string;
  ServerId: string;
  Id: string;
  SortName: string;
  PremiereDate: string;
  ChannelId: string | null;
  RunTimeTicks: number;
  ProductionYear: number;
  IsFolder: boolean;
  Type: string;
  ParentBackdropItemId: string;
  ParentBackdropImageTags: Array<string>;
  UserData: UserData;
  PrimaryImageAspectRatio: number;
  Artists: Array<string>;
  ArtistsItems: Array<NameId>;
  AlbumArtist: string;
  AlbumArtists: Array<NameId>;
  ImageTags: Object;
  BackdropImageTags: Array<any>;
  ImageBlurHashes: Object;
  LocationType: string;
}

type LibraryItemList = {
  Items: Array<MediaItem>;
  StartIndex: number;
  TotalRecordCount: number;
};

type Headers = {
  [key: string]: string;
};

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

type Session = {
  hostname: string;
  accessToken: string;
  userId: string;
  username: string;
  maxBitrateMobile: number;
  maxBitrateWifi: number;
  deviceId: string;
};

type MediaType = 'Album' | 'Song' | 'Playlist' | 'Folder';

type ScreenMode = 'ListView' | 'PlayerView';

type SortBy = 'SortName' | 'Random' | 'DateCreated' | 'PlayCount';

type SortOrder = 'Ascending' | 'Descending';

type Filters = 'IsFavorite' | '';

type DownloadStatus = 'started' | 'active' | 'success' | 'failure';

type isDownloaded = 'isDownloaded' | 'isNotDownloaded' | 'loading';

type NavigationDestination = 'Artist' | 'Album';

type SuccessMessage = 'success' | 'fail' | 'not triggered';

type favoriteAction = 'POST' | 'DELETE';

type ItemTypes = 'Audio' | 'MusicAlbum';

type SelectedStorageLocation =
  | 'DocumentDirectory'
  | 'DownloadDirectory'
  | 'ExternalDirectory';

type Result<T, E = Error> = {ok: true; value: T} | {ok: false; error: E};

/*
 * Customizable shortcut for the homescreen
 */
interface CustomHomeListItem {
  title: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: Filters;
  genreId: string;
  searchQuery: string;
}

interface TrackBoum extends Track {
  id: string;
  artistId: string;
  albumId: string;
  isFavorite: boolean;
  headers: Headers;
}

export type {
  CustomHomeListItem,
  DownloadStatus,
  favoriteAction,
  Filters,
  isDownloaded,
  ItemTypes,
  LibraryItemList,
  MediaItem,
  MediaType,
  NavigationDestination,
  PlayerItem,
  Result,
  ScreenMode,
  SelectedStorageLocation,
  Session,
  SortBy,
  SortOrder,
  SuccessMessage,
  TrackBoum,
};
