import {useEffect} from 'react';

const useValidateLogin = (
  hostname: string,
  username: string,
  password: string,
  isValidUrl: boolean,
  setIsValidUrl: (boolean: boolean) => void,

  setLoginDisabled: (boolean: boolean) => void,
) => {
  useEffect(() => {
    if (hostname.includes('http://') || hostname.includes('https://')) {
      setIsValidUrl(true);
    } else {
      setIsValidUrl(false);
    }
  }, [hostname]);

  useEffect(() => {
    if (isValidUrl && username.length >= 1) {
      setLoginDisabled(false);
    }
  }, [hostname, username, password]);
};

export {useValidateLogin};
