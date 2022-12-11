import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {ContextAction} from '@boum/components/ContextMenu';
import {MediaItem, Session, SuccessMessage} from '@boum/types';
import {useStore} from '@boum/hooks';

type ContextActionLikeProps = {
  mediaItem: MediaItem;
  session: Session;
};

const ContextActionLike = ({session, mediaItem}: ContextActionLikeProps) => {
  const jellyfin = useStore.getState().jellyfinClient;
  const [actionStatus, setActionStatus] =
    useState<SuccessMessage>('not triggered');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    // Needed since the Trackplayer item and the MediaItem from Jellyfin
    // aren't identical.
    if (mediaItem.isFavorite !== undefined) {
      setIsFavorite(mediaItem.isFavorite);
    } else {
      setIsFavorite(mediaItem.UserData.IsFavorite);
    }
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
              .postFavorite(
                session,
                mediaItem.Id ? mediaItem.Id : mediaItem.id,
                'DELETE',
              )
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
              .postFavorite(
                session,
                mediaItem.Id ? mediaItem.Id : mediaItem.id,
                'POST',
              )
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
