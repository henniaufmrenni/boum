import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  ContextActionAddToQueue,
  ContextActionLike,
  ContextActionPlaybackSpeed,
  ContextActionPlaylist,
  ContextActionPlayNext,
  ContextActionSleeptimer,
} from '@boum/components/ContextMenu';
import {colours, sizes} from '@boum/constants';
import {useBitrateLimit, useStore} from '@boum/hooks';
import {
  LibraryItemList,
  MediaItem,
  MediaType,
  PlayerItem,
  ScreenMode,
  Session,
} from '@boum/types';
import {CastButton} from 'react-native-google-cast';

const {SlideInMenu} = renderers;

type ContextMenuHeaderProps = {
  mediaType: MediaType;
  mediaItem: MediaItem;
  session: Session;
};

const ContextMenuHeader = ({
  mediaItem,
  mediaType,
  session,
}: ContextMenuHeaderProps) => {
  return (
    <View>
      <View style={contextMenuStyles.imageContainer}>
        <FastImage
          source={{
            uri: `${session.hostname}/Items/${mediaItem.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
            headers: {
              Accept: 'image/avif,image/webp,*/*',
            },
          }}
          style={contextMenuStyles.image}
        />
      </View>
      <Text style={contextMenuStyles.headerTitle}>{mediaItem.Name}</Text>
      <Text style={contextMenuStyles.headerArtist}>
        {mediaItem.AlbumArtist}
      </Text>
      <Text style={contextMenuStyles.headerMediaType}>{mediaType}</Text>
    </View>
  );
};

type ContextMenuHeaderPlayerProps = {
  mediaItem: PlayerItem;
};

const ContextMenuHeaderPlayer = ({mediaItem}: ContextMenuHeaderPlayerProps) => {
  return (
    <View>
      <Text style={contextMenuStyles.headerTitle}>{mediaItem.title}</Text>
      <Text style={contextMenuStyles.headerArtist}>{mediaItem.artist}</Text>
      <View style={contextMenuStyles.imageContainer}>
        <FastImage
          source={{
            uri: mediaItem.artwork,
            headers: {
              Accept: 'image/avif,image/webp,*/*',
            },
          }}
          style={contextMenuStyles.image}
        />
      </View>
      <Text style={contextMenuStyles.headerMediaType}>Track</Text>
    </View>
  );
};

type SlideInContextMenuProps = {
  children: React.ReactNode;
  mediaType: MediaType;
  mediaItem: MediaItem;
  listItems?: LibraryItemList;
  session: Session;
  screenMode: ScreenMode;
};

const SlideInContextMenu = ({
  children,
  mediaItem,
  listItems,
  mediaType,
  session,
  screenMode,
}: SlideInContextMenuProps) => {
  const bitrateLimit = useBitrateLimit();
  const currentTrack = useStore(state => state.currentTrack);
  const castDevice = useStore(state => state.castDevice);
  return (
    <Menu renderer={SlideInMenu}>
      <MenuTrigger>
        <Text style={contextMenuStyles.actionButton}>
          <Icon
            name="ellipsis-vertical-sharp"
            size={25}
            color={colours.white}
          />
        </Text>
      </MenuTrigger>
      <MenuOptions
        customStyles={contextMenuStyles}
        renderOptionsContainer={() => (
          <ScrollView>
            {screenMode === 'PlayerView' ? (
              <>
                <ContextMenuHeaderPlayer
                  mediaItem={mediaItem}
                  session={session}
                />
                <ContextActionLike mediaItem={mediaItem} session={session} />
                <ContextActionSleeptimer />
                <ContextActionPlaybackSpeed />
              </>
            ) : mediaType === 'Folder' ? (
              <ContextMenuHeader
                mediaItem={mediaItem}
                mediaType={mediaType}
                session={session}
              />
            ) : (
              <>
                <ContextMenuHeader
                  mediaItem={mediaItem}
                  mediaType={mediaType}
                  session={session}
                />
                <ContextActionLike mediaItem={mediaItem} session={session} />
                <ContextActionPlaylist item={mediaItem} session={session} />
                {/* FIXME: Add this functionality for casting aswell. */}
                {castDevice === null ? (
                  <>
                    <ContextActionAddToQueue
                      item={mediaItem}
                      bitrateLimit={bitrateLimit}
                      session={session}
                      listItems={listItems}
                    />
                    <ContextActionPlayNext
                      item={mediaItem}
                      bitrateLimit={bitrateLimit}
                      session={session}
                      listItems={listItems}
                      currentTrack={currentTrack}
                    />
                  </>
                ) : null}
              </>
            )}
            {children}
            {castDevice === null ? (
              <CastButton style={contextMenuStyles.castButtonContainer} />
            ) : null}
          </ScrollView>
        )}
      />
    </Menu>
  );
};

const contextMenuStyles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: 'rgba(17, 24, 32, 0.97)',
    maxHeight: 500,
    paddingVertical: sizes.marginListX * 2,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  optionsWrapper: {
    paddingHorizontal: 20,
  },
  optionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colours.white,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: sizes.marginListX,
    color: colours.white,
    fontSize: 22,
    alignSelf: 'center',
  },
  headerArtist: {
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: sizes.marginListX,
    color: colours.white,
    fontSize: 16,
    alignSelf: 'center',
  },
  headerMediaType: {
    fontFamily: 'Inter-Medium',
    paddingHorizontal: sizes.marginListX,
    color: colours.white,
    fontSize: 17,
    alignSelf: 'center',
  },
  actionButton: {
    alignSelf: 'center',
  },
  imageContainer: {
    elevation: 6,
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: sizes.marginListX,
  },
  image: {
    width: 100,
    height: 100,
  },
  castButtonContainer: {
    marginVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
});

export {SlideInContextMenu};
