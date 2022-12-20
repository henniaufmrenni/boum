import {Filters, MediaItem, SortBy, SortOrder} from '@boum/types';

type Session = {
  hostname: string;
  accessToken: string;
  userId: string;
  username: string;
  maxBitrateMobile: number;
  maxBitrateWifi: number;
  maxBitrateVideo: number;
  maxBitrateDownloadAudio: number;
  deviceName: string;
  deviceId: string;
  chromecastAdress: string | null;
  chromecastAdressEnabled: boolean;
  offlineMode: boolean;
  selectedStorageLocation: SelectedStorageLocation;
};

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

type Headers = {
  [key: string]: string;
};

type ScreenMode = 'ListView' | 'PlayerView';

type DownloadStatus = 'started' | 'active' | 'success' | 'failure';

type IsDownloaded = 'isDownloaded' | 'isNotDownloaded' | 'loading';

type NavigationDestination = 'Artist' | 'Album';

type SuccessMessage = 'success' | 'fail' | 'not triggered';

type OfflineItem = {
  id: string;
  name: string;
  metadata: MediaItem;
  children: Array<MediaItem>;
};

/*
 * DB types
 */

// Audio with id
type SingleItem = {
  id: string;
  parentId: string;
  fileLocation: string;
  imageLocation: string;
  metaData: string;
  status: string;
};

// Album | Playlist
type ParentItem = {
  id: number;
  metaData: string;
};

enum TableName {
  SingleItems = 'single_items',
  ParentItems = 'parent_items',
  KeyValue = 'key_value',
  CustomLists = 'custom_lists',
}

export {TableName};

export type {
  CustomHomeListItem,
  DownloadStatus,
  Headers,
  IsDownloaded,
  NavigationDestination,
  OfflineItem,
  ParentItem,
  Result,
  ScreenMode,
  SelectedStorageLocation,
  Session,
  SingleItem,
  SuccessMessage,
};
