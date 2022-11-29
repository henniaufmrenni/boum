import {Filters, SortBy, SortOrder} from '@boum/types';

type Session = {
  hostname: string;
  accessToken: string;
  userId: string;
  username: string;
  maxBitrateMobile: number;
  maxBitrateWifi: number;
  maxBitrateVideo: number;
  deviceId: string;
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

type isDownloaded = 'isDownloaded' | 'isNotDownloaded' | 'loading';

type NavigationDestination = 'Artist' | 'Album';

type SuccessMessage = 'success' | 'fail' | 'not triggered';

type TableName =
  | 'single_items'
  | 'parent_items'
  | 'key_value'
  | 'custom_lists'
  | 'movies_items';

export type {
  Headers,
  SelectedStorageLocation,
  Result,
  CustomHomeListItem,
  DownloadStatus,
  isDownloaded,
  NavigationDestination,
  SuccessMessage,
  ScreenMode,
  Session,
};
