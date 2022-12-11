import {useEffect, useState} from 'react';

import {useBooksStore, useStore} from '@boum/hooks';
import addNewItemsToOldObject from '@boum/lib/helper/addNewItemsToOldObject';
import {Session} from '@boum/types';

const useGetBooks = (session: Session) => {
  const jellyfin = useStore.getState().jellyfinClient;
  // Infinite Loading
  const startIndex = useBooksStore(state => state.itemsPageIndex);

  const [loadedMore, setLoadedMore] = useState(false);
  const allAudiobooks = useBooksStore(state => state.allItems);
  const setAllAudiobooks = useBooksStore(state => state.setAllItems);

  // Sorting & Filtering
  const sortBy = useBooksStore(state => state.sortBy);
  const sortOrder = useBooksStore(state => state.sortOrder);
  const searchTerm = useBooksStore(state => state.searchTerm);

  const [apiResponse, setApiResponse] = useState<boolean | object>(false);

  if (apiResponse && !loadedMore) {
    const newAlbumItems = addNewItemsToOldObject(
      startIndex,
      allAudiobooks,
      apiResponse,
    );
    setAllAudiobooks(newAlbumItems);
    setLoadedMore(true);
    setApiResponse(false);
  }

  useEffect(() => {
    const getData = async () => {
      await jellyfin
        .getAllBooks(session, startIndex, sortBy, sortOrder, '', searchTerm)
        .then(data => {
          if (!data.allBooksError) {
            setApiResponse(data.allBooksData);
            setLoadedMore(true);
          }
        })
        .catch(err => {
          console.warn('Errror getting audiobooks', err);
        });
    };
    getData();
  }, [startIndex]);

  return {
    allAudiobooks,
    setLoadedMore,
  };
};

export {useGetBooks};
