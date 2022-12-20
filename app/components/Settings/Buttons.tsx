import React from 'react';

import {ButtonBoum} from '@boum/components/Settings';
import {logout} from '@boum/lib/settings';

const LogoutButton = () => {
  return (
    <ButtonBoum
      onPress={async () =>
        await logout()
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
