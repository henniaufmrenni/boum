import {any} from 'prop-types';
import {RepeatMode} from 'react-native-track-player';
import create from 'zustand';

import {
  DownloadStatus,
  Session,
  SortBy,
  SortOrder,
  Filters,
  SelectedStorageLocation,
  CustomHomeListItem,
} from '@boum/types';
import {State} from 'react-native-gesture-handler';
import {useGetCustomLists} from './useGetCustomLists';

type BaseStore = {
  session: Session | null;
  gotLoginStatus: boolean;
  homeData: object | null;
  queue: Object | null;
  currentTrack: Object | null;
  device: Object | null;
  initializedState: boolean;
  networkStatus: ConnectionType | null;
  repeatMode: RepeatMode;
  db: any;
  selectedStorageLocation: SelectedStorageLocation;
  setSelectedStorageLocation: (value: SelectedStorageLocation) => void;
  offlineMode: boolean;
  playerIsSetup: boolean;
  toggleOfflineMode: () => void;
  setOfflineMode: (state: boolean) => void;
  sleepTimer: number;
  setSleepTimer: (time: number) => void;
  playbackUpdate: number;
  setPlaybackUpdate: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  refreshHomeScreen: number;
  setRefreshHomeScreen: () => void;
  customLists: false | Array<CustomHomeListItem>;
  setCustomLists: (input: Array<CustomHomeListItem> | false) => void;
};

const useStore = create<BaseStore>(set => ({
  session: null,
  gotLoginStatus: false,
  homeData: null,
  queue: null,
  currentTrack: null,
  device: '',
  initializedState: false,
  networkStatus: false,
  repeatMode: RepeatMode.Off,
  db: any,
  selectedStorageLocation: 'DocumentDirectory',
  setSelectedStorageLocation: (value: SelectedStorageLocation) =>
    set(state => ({selectedStorageLocation: value})),
  offlineMode: false,
  playerIsSetup: false,
  toggleOfflineMode: () => set(state => ({offlineMode: !state.offlineMode})),
  setOfflineMode: (state: boolean) => set({offlineMode: state}),
  sleepTimer: 0,
  setSleepTimer: (timer: number) => set({sleepTimer: timer}),
  playbackUpdate: 0,
  setPlaybackUpdate: () =>
    set(state => ({playbackUpdate: ++state.playbackUpdate})),
  playbackSpeed: 1,
  setPlaybackSpeed: (speed: number) => set({playbackSpeed: speed}),
  customLists: false,
  setCustomLists: (input: Array<CustomHomeListItem> | false) =>
    set({customLists: input}),
  refreshHomeScreen: 0,
  setRefreshHomeScreen: () =>
    set(state => ({refreshHomeScreen: ++state.refreshHomeScreen})),
}));

type ItemsStore = {
  itemsPageIndex: number;
  increaseItemsPageIndex: () => void;
  resetItemsPageIndex: () => void;
  allItems: boolean | Object;
  setAllItems: (object: Object | boolean) => void;
  sortBy: SortBy;
  setSortBy: (options: SortBy) => void;
  sortOrder: SortOrder;
  setSortOrder: (options: SortOrder) => void;
  searchTerm: string;
  setSearchTerm: (query: string) => void;
  filters: Filters;
  setFilters: (query: Filters) => void;
};

const useAlbumsStore = create<ItemsStore>(set => ({
  itemsPageIndex: 0,
  increaseItemsPageIndex: () =>
    set(state => ({itemsPageIndex: state.itemsPageIndex + 40})),
  resetItemsPageIndex: () => set({itemsPageIndex: 0}),
  allItems: false,
  setAllItems: object => set({allItems: object}),
  sortBy: 'SortName',
  setSortBy: options => set({sortBy: options}),
  sortOrder: 'Ascending',
  setSortOrder: options => set({sortOrder: options}),
  searchTerm: '',
  setSearchTerm: query => set({searchTerm: query}),
  filters: '',
  setFilters: filters => set({filters: filters}),
}));

const useBooksStore = create<ItemsStore>(set => ({
  itemsPageIndex: 0,
  increaseItemsPageIndex: () =>
    set(state => ({itemsPageIndex: state.itemsPageIndex + 40})),
  resetItemsPageIndex: () => set({itemsPageIndex: 0}),
  allItems: false,
  setAllItems: object => set({allItems: object}),
  sortBy: 'SortName',
  setSortBy: options => set({sortBy: options}),
  sortOrder: 'Ascending',
  setSortOrder: options => set({sortOrder: options}),
  searchTerm: '',
  setSearchTerm: query => set({searchTerm: query}),
  filters: '',
  setFilters: filters => set({filters: filters}),
}));

const useArtistsStore = create<ItemsStore>(set => ({
  itemsPageIndex: 0,
  increaseItemsPageIndex: () =>
    set(state => ({itemsPageIndex: state.itemsPageIndex + 40})),
  resetItemsPageIndex: () => set({itemsPageIndex: 0}),
  allItems: false,
  setAllItems: object => set({allItems: object}),
  sortBy: 'SortName',
  setSortBy: options => set({sortBy: options}),
  sortOrder: 'Ascending',
  setSortOrder: options => set({sortOrder: options}),
  searchTerm: '',
  setSearchTerm: query => set({searchTerm: query}),
  filters: '',
  setFilters: filters => set({filters: filters}),
}));

const usePlaylistsStore = create<ItemsStore>(set => ({
  itemsPageIndex: 0,
  increaseItemsPageIndex: () =>
    set(state => ({itemsPageIndex: state.itemsPageIndex + 40})),
  resetItemsPageIndex: () => set({itemsPageIndex: 0}),
  allItems: false,
  setAllItems: object => set({allItems: object}),
  sortBy: 'SortName',
  setSortBy: options => set({sortBy: options}),
  sortOrder: 'Ascending',
  setSortOrder: options => set({sortOrder: options}),
  searchTerm: '',
  setSearchTerm: query => set({searchTerm: query}),
  filters: '',
  setFilters: filters => set({filters: filters}),
}));

const useTracksStore = create<ItemsStore>(set => ({
  itemsPageIndex: 0,
  increaseItemsPageIndex: () =>
    set(state => ({itemsPageIndex: state.itemsPageIndex + 40})),
  resetItemsPageIndex: () => set({itemsPageIndex: 0}),
  allItems: false,
  setAllItems: object => set({allItems: object}),
  sortBy: 'SortName',
  setSortBy: options => set({sortBy: options}),
  sortOrder: 'Ascending',
  setSortOrder: options => set({sortOrder: options}),
  searchTerm: '',
  setSearchTerm: query => set({searchTerm: query}),
  filters: '',
  setFilters: filters => set({filters: filters}),
}));

type SearchStoreState = {
  searchInput: string;
  setSearchInput: (string: string) => void;
};

const useSearchStore = create<SearchStoreState>(set => ({
  searchInput: '',
  setSearchInput: input => set({searchInput: input}),
}));

type DownloadQueueItem = {
  parentName: string;
  parentId: string;
  itemName: string;
  itemId: string;
  progress: number;
  jobId: number;
  statusCode: number;
  status: DownloadStatus;
};

type DownloadsStoreState = {
  downloadQueue: Array<DownloadQueueItem>;
  updateStatusDownloadQueue: (itemId: string, status: DownloadStatus) => void;
  setDownloadQueue: (input: DownloadQueueItem) => void;
};

const useDownloadsStore = create<DownloadsStoreState>(set => ({
  downloadQueue: [],
  updateStatusDownloadQueue: (id: string, status: DownloadStatus) =>
    set(state => ({
      downloadQueue: (state.downloadQueue.findIndex(
        obj => obj.itemId === id,
      ).status = status),
    })),
  setDownloadQueue: (input: DownloadQueueItem) => {
    set(state => ({downloadQueue: state.downloadQueue.push(input)}));
  },
}));

export {
  useAlbumsStore,
  useArtistsStore,
  useBooksStore,
  useDownloadsStore,
  usePlaylistsStore,
  useSearchStore,
  useStore,
  useTracksStore,
};
