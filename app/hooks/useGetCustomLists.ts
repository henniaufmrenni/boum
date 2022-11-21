import {useEffect} from 'react';
import {getCustomLists} from '@boum/lib/db/customLists';
import {useStore} from '@boum/hooks/useStore';

const useGetCustomLists = (refresh: number) => {
  const setCustomLists = useStore(state => state.setCustomLists);

  useEffect(() => {
    async function getItems() {
      await getCustomLists().then(res => setCustomLists(res));
    }
    getItems();
  }, [refresh]);
};

export {useGetCustomLists};
