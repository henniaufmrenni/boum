import {useStore} from '@boum/hooks';

const useSetSleepTimer = (minutes: number) => {
  const timer = Date.now() + minutes * 60000;
  useStore.setState({sleepTimer: timer});
};

export {useSetSleepTimer};
