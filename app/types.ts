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

type MediaItem = {
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
};

type LibraryItemList = {
  Items: Array<MediaItem>;
  StartIndex: number;
  TotalRecordCount: number;
};

type Headers = {
  [key: string]: string;
};

type PlayerItem = {
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
};

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

type SortBy = 'SortName' | 'Random' | 'DateCreated';

type SortOrder = 'Ascending' | 'Descending';

type Filter = 'IsFavorite' | '';

type DownloadStatus = 'started' | 'active' | 'success' | 'failure';

type isDownloaded = 'isDownloaded' | 'isNotDownloaded' | 'loading';

type NavigationDestination = 'Artist' | 'Album';

type SuccessMessage = 'success' | 'fail' | 'not triggered';

type favoriteAction = 'POST' | 'DELETE';

export type {
  MediaItem,
  Session,
  SortBy,
  SortOrder,
  Filter,
  DownloadStatus,
  isDownloaded,
  NavigationDestination,
  MediaType,
  ScreenMode,
  PlayerItem,
  SuccessMessage,
  LibraryItemList,
  favoriteAction,
};
