import React from 'react';

import {ContextAction} from '@boum/components/ContextMenu';
import {PlaybackSpeedPicker} from '@boum/components/Player';

const ContextActionPlaybackSpeed = () => {
  return (
    <ContextAction
      title="Set Playback Speed"
      ioniconIcon="speedometer"
      action={() => {
        return;
      }}
      children={<PlaybackSpeedPicker />}
    />
  );
};

export {ContextActionPlaybackSpeed};
