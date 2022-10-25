import React from 'react';
import {Alert, Linking} from 'react-native';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';

type OpenURLButtonProps = {
  url: string;
  title: string;
};

const OpenURLButton: React.FC<OpenURLButtonProps> = ({url, title}) => {
  const handleClick = () => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Don't know how to open URI: " + url);
      }
    });
  };

  return <ButtonBoum title={title} onPress={handleClick} />;
};

export {OpenURLButton};
