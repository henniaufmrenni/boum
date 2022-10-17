import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {ContextAction} from '@boum/components/ContextMenu/ContextAction';
import {colours, sizes} from '@boum/constants';
import {MediaItem, Session, SuccessMessage} from '@boum/types';
import {jellyfinClient} from '@boum/lib/api';

type PlaylistContextMenuProps = {
  item: MediaItem;
  session: Session;
  playlist: Object;
  apiClient: jellyfinClient;
};

const PlaylistContextMenu = ({
  item,
  session,
  playlist,
  apiClient,
}: PlaylistContextMenuProps) => {
  const [actionStatus, setActionStatus] =
    useState<SuccessMessage>('not triggered');

  return (
    <TouchableOpacity
      onPress={async () => {
        const status = await apiClient.addOrRemoveSongPlaylist(
          session,
          item.Id,
          playlist.Id,
          'POST',
        );
        if (status === 204) {
          setActionStatus('success');
        } else {
          setActionStatus('failure');
        }
      }}>
      <View>
        <Text style={playlistViewStyles.optionText}>
          {playlist.Name}
          {actionStatus === 'success' ? (
            <Icon name="checkmark-circle" size={20} color={colours.green} />
          ) : actionStatus === 'fail' ? (
            <Icon name="close-circle" size={20} color={'red'} />
          ) : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type ContextActionPlaylistsViewProps = {
  item: MediaItem;
  session: Session;
};

const PlaylistsViewContextMenu = ({
  item,
  session,
}: ContextActionPlaylistsViewProps) => {
  const jellyfin = new jellyfinClient();
  const {allPlaylistsData, allPlaylistsError, allPlaylistsLoading} =
    jellyfin.getAllPlaylists(session, 0, 'SortName', 'Ascending', '', '');

  return (
    <>
      {!allPlaylistsError &&
      !allPlaylistsLoading &&
      allPlaylistsData.TotalRecordCount >= 1 ? (
        <View style={playlistViewStyles.optionsContainer}>
          {allPlaylistsData.Items.map(playlist => (
            <PlaylistContextMenu
              session={session}
              playlist={playlist}
              item={item}
              key={playlist.Id}
              apiClient={jellyfin}
            />
          ))}
        </View>
      ) : !allPlaylistsLoading && allPlaylistsData.TotalRecordCount === 0 ? (
        <>
          <Text style={playlistViewStyles.optionText}>No Playlists</Text>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const playlistViewStyles = StyleSheet.create({
  optionsContainer: {
    paddingBottom: sizes.marginListX / 2,
    paddingLeft: sizes.marginListX * 4,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  optionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colours.white,
  },
});

type ContextActionAddToPlaylistProps = {
  item: MediaItem;
  session: Session;
};

const ContextActionPlaylist = ({
  item,
  session,
}: ContextActionAddToPlaylistProps) => {
  const [playlistViewOpen, setPlaylistViewOpen] = useState(false);
  return (
    <ContextAction
      title="Add to playlist"
      ioniconIcon="add-outline"
      action={() => setPlaylistViewOpen(!playlistViewOpen)}>
      {playlistViewOpen ? (
        <PlaylistsViewContextMenu session={session} item={item} />
      ) : null}
    </ContextAction>
  );
};

export {ContextActionPlaylist};
