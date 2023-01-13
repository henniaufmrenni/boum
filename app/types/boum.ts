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

type UnfinishedDownload = {
  id: string;
  fileLocation: string;
  status: DownloadStatus;
  imageLocation: string;
};

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

enum DownloadStatus {
  Started = 'started',
  Pending = 'pending',
  Success = 'success',
  Failure = 'failure',
}

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

type DownloadQueueItem = {
  jobId: number;
  itemId: string;
  status: DownloadStatus;
};

enum DownloadListType {
  Playlist = 'playlist',
  Album = 'album',
}

enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH',
}

export {DownloadListType, TableName, DownloadStatus, HttpMethod};

export type {
  CustomHomeListItem,
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
  DownloadQueueItem,
  UnfinishedDownload,
};
