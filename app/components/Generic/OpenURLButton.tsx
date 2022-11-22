import React from 'react';
import {Alert, Linking} from 'react-native';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';
import {handleClick} from '@boum/lib/helper';

type OpenURLButtonProps = {
  url: string;
  title: string;
};

const OpenURLButton: React.FC<OpenURLButtonProps> = ({url, title}) => {
  return <ButtonBoum title={title} onPress={() => handleClick(url)} />;
};

export {OpenURLButton};
