import React, {useCallback} from 'react';
import {Alert, Linking} from 'react-native';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';

type OpenURLButtonProps = {
  url: string;
  title: string;
};

const OpenURLButton: React.FC<OpenURLButtonProps> = ({url, title}) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <ButtonBoum title={title} onPress={handlePress} />;
};

export {OpenURLButton};
