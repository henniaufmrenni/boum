import uuid from 'react-native-uuid';

import {versionBoum} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session} from '@boum/types';

const useLogin = async (
  hostname: string,
  username: string,
  password: string,
  setLoginStatus: (string: string) => void,
) => {
  const deviceId = uuid.v4();
  const response = await getToken(
    hostname,
    username,
    password,
    deviceId,
    setLoginStatus,
  );

  if (response.error == null) {
    return "Coudln't login.";
  } else {
    const res = response.res;
    const item: Session = {
      hostname: hostname,
      accessToken: res.AccessToken,
      userId: res.SessionInfo.UserId,
      username: res.SessionInfo.UserName,
      maxBitrateWifi: 140000000,
      maxBitrateMobile: 140000000,
      maxBitrateVideo: 100000000,
      maxBitrateDownloadAudio: 140000000,
      deviceId: deviceId,
    };

    try {
      await storeEncryptedValue('user_session', JSON.stringify(item));
      useStore.setState({session: JSON.stringify(item)});
      useStore.setState({gotLoginStatus: true});
    } catch (error) {
      return 'Error in saving User session.';
    }
  }
};

const getToken = async (
  url: string,
  username: string,
  password: string,
  deviceId: string,
  setLoginStatus: (string: string) => void,
) => {
  const clientHeaders = `MediaBrowser Client="boum", Device="boum", DeviceId="${deviceId}", Version="${versionBoum}"`;
  return fetch(`${url}/Users/authenticatebyname`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Emby-Authorization': clientHeaders,
    },
    body: JSON.stringify({
      Username: username,
      Pw: password,
    }),
  })
    .then(response => {
      if (response.status === 401) {
        setLoginStatus('Wrong username / password');
        return;
      }
      return response.json();
    })
    .then(json => {
      return {res: json, error: false};
    })
    .catch(error => {
      console.error(error);
      setLoginStatus('Network request failed');
      return {res: error, error: true};
    });
};

export {useLogin};
