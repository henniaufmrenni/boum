import React from 'react';

import {ContextAction} from '@boum/components/ContextMenu';
import {addAlbumToQueue} from '@boum/lib/audio';
import {LibraryItemList, MediaItem, Session} from '@boum/types';

type ContextActionPlayNextProps = {
  item: MediaItem;
  listItems?: LibraryItemList;
  session: Session;
  bitrateLimit: number;
  currentTrack: number;
};

const ContextActionPlayNext = ({
  item,
  session,
  bitrateLimit,
  listItems,
  currentTrack,
}: ContextActionPlayNextProps) => {
  let trackArray: Array<MediaItem>;
  if (listItems) {
    trackArray = listItems.Items;
  } else {
    trackArray = [item];
  }
  return (
    <ContextAction
      title="Play next"
      ioniconIcon="list-outline"
      action={() =>
        addAlbumToQueue(trackArray, session, bitrateLimit, currentTrack + 1)
      }
    />
  );
};

export {ContextActionPlayNext};
