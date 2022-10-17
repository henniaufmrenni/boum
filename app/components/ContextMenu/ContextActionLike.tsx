import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {ContextAction} from '@boum/components/ContextMenu';
import {colours} from '@boum/constants';
import {Session, SuccessMessage} from '@boum/types';
import {jellyfinClient} from '@boum/lib/api';

type ContextActionLikeProps = {
  itemId: string;
  session: Session;
};

const ContextActionLike = ({session, itemId}: ContextActionLikeProps) => {
  const jellyfin = new jellyfinClient();
  const [actionStatus, setActionStatus] =
    useState<SuccessMessage>('not triggered');
  return (
    <ContextAction
      title="Like"
      ioniconIcon="ios-heart"
      action={async () => {
        await jellyfin.postFavorite(session, itemId, 'POST').then(status => {
          if (status === 200) {
            setActionStatus('success');
          } else {
            setActionStatus('fail');
          }
        });
      }}
      actionStatusMessage={
        <>
          {actionStatus === 'success' ? (
            <Icon name="checkmark-circle" size={25} color={colours.green} />
          ) : actionStatus === 'fail' ? (
            <Icon name="close-circle" size={25} color={'red'} />
          ) : null}
        </>
      }
    />
  );
};

export {ContextActionLike};
