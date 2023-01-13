import {useEffect} from 'react';
import {useStore} from '@boum/hooks/useStore';

const useGetCustomLists = (refresh: number) => {
  const setCustomLists = useStore(state => state.setCustomLists);
  const dbService = useStore.getState().dbService;

  useEffect(() => {
    async function getItems() {
      await dbService.getCustomLists().then(res => setCustomLists(res));
    }
    getItems();
  }, [refresh, setCustomLists]);
};

export {useGetCustomLists};
