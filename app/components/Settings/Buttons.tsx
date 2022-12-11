import React from 'react';

import {ButtonBoum} from '@boum/components/Settings';
import useLogout from '@boum/hooks/useLogout';

const LogoutButton = () => {
  return (
    <ButtonBoum
      onPress={async () =>
        await useLogout()
          .then(response => {
            console.log('Logged out', response);
          })
          .catch(error => {
            console.warn('Error logging out', error);
          })
      }
      title={'Logout'}
    />
  );
};

export {LogoutButton};
