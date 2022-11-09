import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {ContextAction} from '@boum/components/ContextMenu';
import {MediaItem, Session, SuccessMessage} from '@boum/types';
import {jellyfinClient} from '@boum/lib/api';

type ContextActionLikeProps = {
  mediaItem: MediaItem;
  session: Session;
};

const ContextActionLike = ({session, mediaItem}: ContextActionLikeProps) => {
  const jellyfin = new jellyfinClient();
  const [actionStatus, setActionStatus] =
    useState<SuccessMessage>('not triggered');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    setIsFavorite(mediaItem.UserData.IsFavorite);
    setActionStatus('not triggered');
  }, []);

  return (
    <>
      {isFavorite ? (
        <ContextAction
          title="Like"
          ioniconIcon="ios-heart"
          action={async () => {
            await jellyfin
              .postFavorite(session, mediaItem.Id, 'DELETE')
              .then(status => {
                if (status === 200) {
                  setActionStatus('success');
                  setIsFavorite(false);
                } else {
                  setActionStatus('fail');
                }
              });
          }}
          actionStatusMessage={
            <>
              {actionStatus === 'fail' ? (
                <Icon name="close-circle" size={25} color={'red'} />
              ) : null}
            </>
          }
        />
      ) : (
        <ContextAction
          title="Like"
          ioniconIcon="ios-heart-outline"
          action={async () => {
            await jellyfin
              .postFavorite(session, mediaItem.Id, 'POST')
              .then(status => {
                if (status === 200) {
                  setIsFavorite(true);
                } else {
                  setActionStatus('fail');
                }
              });
          }}
          actionStatusMessage={
            <>
              {actionStatus === 'fail' ? (
                <Icon name="close-circle" size={25} color={'red'} />
              ) : null}
            </>
          }
        />
      )}
    </>
  );
};

export {ContextActionLike};
