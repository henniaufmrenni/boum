import {useEffect} from 'react';
import {FileLogger} from 'react-native-file-logger';

const useFileLogger = () => {
  useEffect(() => {
    FileLogger.configure({
      captureConsole: true,
      logsDirectory: '/storage/emulated/0/Download',
    }).then(() => console.log('File-logger configured'));
  }, []);
};

export {useFileLogger};
