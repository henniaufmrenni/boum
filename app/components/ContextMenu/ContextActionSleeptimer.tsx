import React from 'react';

import {ContextAction} from '@boum/components/ContextMenu';
import SleeptimePicker from '@boum/components/Player/SleeptimePicker';

const ContextActionSleeptimer = () => {
  return (
    <ContextAction
      title="Set sleeptimer"
      ioniconIcon="moon"
      action={() => console.log('pressed')}
      children={<SleeptimePicker />}
    />
  );
};

export {ContextActionSleeptimer};
