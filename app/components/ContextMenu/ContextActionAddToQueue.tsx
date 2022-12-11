import React from 'react';

import {ContextAction} from '@boum/components/ContextMenu';
import {addAlbumToQueue} from '@boum/lib/audio';
import {LibraryItemList, MediaItem, Session} from '@boum/types';

type ContextActionAddToQueueProps = {
  item: MediaItem;
  listItems?: LibraryItemList;
  session: Session;
  bitrateLimit: number;
};

const ContextActionAddToQueue = ({
  item,
  session,
  bitrateLimit,
  listItems,
}: ContextActionAddToQueueProps) => {
  let trackArray: Array<MediaItem>;
  if (listItems) {
    trackArray = listItems.Items;
  } else {
    trackArray = [item];
  }
  return (
    <ContextAction
      title="Add to queue"
      ioniconIcon="list-outline"
      action={() => addAlbumToQueue(trackArray, session, bitrateLimit)}
    />
  );
};

export {ContextActionAddToQueue};
