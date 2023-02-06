import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {FadeIn} from 'react-native-reanimated';
import {RemoteMediaClient} from 'react-native-google-cast';

import {LoadingSpinner} from '@boum/components/Generic';
import SingleItemHeader from '@boum/components/SingleItemHeader';
import {colours, sizes} from '@boum/constants';
import {
  addAlbumToQueue,
  playAlbum,
  playAudio,
  playShuffleList,
} from '@boum/lib/audio';
import {getHourMinutes} from '@boum/lib/helper/helper';
import {useStore} from '@boum/hooks';
import {
  HttpMethod,
  IsDownloaded,
  LibraryItemList,
  MediaItem,
  MediaType,
  ScreenMode,
  SelectedStorageLocation,
  Session,
} from '@boum/types';

import {ArtistItems} from '@boum/components/ArtistComponents';
import TrackPlayer from 'react-native-track-player';
import {SlideInContextMenu} from '@boum/components/ContextMenu';

import {CastService} from '@boum/lib/cast';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SwipeableRow} from '@boum/components/Lists';

const width = Dimensions.get('window').width;

type ListHeaderProps = {
  albumItems: LibraryItemList;
  item: MediaItem;
  mediaType: MediaType;
  session: Session;
  averageColorRgb: string;
  navigation: () => void;
  castClient: RemoteMediaClient | null;
  bitrateLimit: number;
  isDownloaded: IsDownloaded;
  isPlaying: boolean;
  itemIsPlaying?: boolean;
  screenMode: ScreenMode;
  selectedStorageLocation?: SelectedStorageLocation;
};

const ListHeader = ({
  albumItems,
  item,
  mediaType,
  session,
  averageColorRgb,
  navigation,
  castClient,
  bitrateLimit,
  isDownloaded,
  isPlaying,
  itemIsPlaying,
  screenMode,
  selectedStorageLocation,
}: ListHeaderProps): JSX.Element => {
  const jellyfin = useStore.getState().jellyfinClient;
  const storageService = useStore.getState().storageService;
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  useEffect(() => {
    // Needed because the /Albums/${artistId}/Similar?limit=6&Fields=Genres
    // endpoint doesn't include the UserData object.
    if (item.UserData !== undefined) {
      setIsFavorite(item.UserData.IsFavorite);
    }
  }, [item.UserData]);

  const cast = useStore(state => state.castService);
  return (
    <>
      {averageColorRgb && item ? (
        <LinearGradient
          colors={[averageColorRgb, colours.black]}
          style={styles.container}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.65}}>
          <>
            {item.Id != null ? (
              <>
                <SingleItemHeader
                  navigation={navigation}
                  mediaItem={item}
                  mediaType={mediaType}
                  session={session}
                  screenMode={screenMode}
                  listItems={albumItems}
                />
                {mediaType !== 'Folder' ? (
                  <Animated.View entering={FadeIn}>
                    <View style={styles.imageContainer}>
                      <FastImage
                        source={{
                          uri: `${session.hostname}/Items/${item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                          headers: {
                            Accept: 'image/avif,image/webp,*/*',
                          },
                        }}
                        style={styles.image}
                      />
                    </View>
                  </Animated.View>
                ) : null}
              </>
            ) : null}
            <Text style={styles.albumTitle}>{item.Name}</Text>
            {item.AlbumArtists ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.push('Artist', {
                    itemId: item.AlbumArtists[0].Id,
                    itemName: item.AlbumArtists[0].Name,
                    item: undefined,
                  })
                }>
                <Text style={styles.artistTitle}>
                  {item.AlbumArtists[0].Name}
                </Text>
              </TouchableOpacity>
            ) : null}
            {item.GenreItems !== undefined ? (
              <Text style={styles.genre}>
                {item.GenreItems.map(genre => genre.Name).join(', ')}
              </Text>
            ) : null}
            {mediaType !== 'Folder' ? (
              <View style={styles.buttonContainer}>
                <View style={styles.actionButtonsContainer}>
                  {isDownloaded === 'isDownloaded' ? (
                    <View
                      style={[
                        styles.actionButton,
                        {marginLeft: sizes.marginListX / 2},
                      ]}>
                      <Text>
                        <Icon
                          name="ios-arrow-down-circle-sharp"
                          size={30}
                          color={colours.accent}
                        />
                      </Text>
                    </View>
                  ) : downloadTriggered === false ? (
                    <TouchableOpacity
                      onPress={async () => {
                        storageService.downloadList(
                          session,
                          albumItems,
                          item,
                          mediaType,
                        );
                        setDownloadTriggered(true);
                      }}
                      style={[
                        styles.actionButton,
                        {marginLeft: sizes.marginListX / 2},
                      ]}>
                      <Text>
                        <Icon
                          name="ios-arrow-down-circle-outline"
                          size={30}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      disabled={true}
                      style={[
                        styles.actionButton,
                        {marginLeft: sizes.marginListX / 2},
                      ]}>
                      <Text>
                        <Icon
                          name="ios-arrow-down-circle-outline"
                          size={30}
                          color={colours.grey['500']}
                        />
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    title="Add to qeue"
                    onPress={async () =>
                      await addAlbumToQueue(
                        albumItems.Items,
                        session,
                        bitrateLimit,
                      )
                    }
                    style={styles.actionButton}>
                    <Text>
                      <Icon name="ios-list" size={30} color={colours.accent} />
                    </Text>
                  </TouchableOpacity>
                  {isFavorite ? (
                    <TouchableOpacity
                      onPress={async () => {
                        await jellyfin
                          .postFavorite(session, item.Id, HttpMethod.DELETE)
                          .then(status => {
                            if (status === 200) {
                              setIsFavorite(false);
                            }
                          });
                      }}
                      style={styles.actionButton}>
                      <Text>
                        <Icon
                          name="ios-heart"
                          size={30}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        await jellyfin
                          .postFavorite(session, item.Id, HttpMethod.POST)
                          .then(status => {
                            if (status === 200) {
                              setIsFavorite(true);
                            }
                          });
                      }}
                      style={styles.actionButton}>
                      <Text>
                        <Icon
                          name="ios-heart-outline"
                          size={30}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    title="Shuffle"
                    onPress={async () =>
                      await playShuffleList(
                        albumItems.Items,
                        session,
                        bitrateLimit,
                      )
                    }
                    style={styles.actionButton}>
                    <Text>
                      <Icon name="shuffle" size={25} color={colours.accent} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {castClient !== null ? (
                    <TouchableOpacity
                      onPress={async () =>
                        await cast.playAlbum(session, albumItems, 0, castClient)
                      }
                      style={styles.playButton}>
                      <Text>
                        <MaterialIcon
                          name="cast-audio-variant"
                          size={70}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  ) : isPlaying && itemIsPlaying ? (
                    <TouchableOpacity
                      title="Pause"
                      onPress={async () => await TrackPlayer.pause()}
                      style={styles.playButton}>
                      <Text>
                        <Icon
                          name="pause-circle"
                          size={80}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  ) : itemIsPlaying ? (
                    <TouchableOpacity
                      title="Play"
                      onPress={async () => await TrackPlayer.play()}
                      style={styles.playButton}>
                      <Text>
                        <Icon
                          name="play-circle"
                          size={80}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      title="Play"
                      onPress={async () =>
                        await playAlbum(albumItems.Items, session, bitrateLimit)
                      }
                      style={styles.playButton}>
                      <Text>
                        <Icon
                          name="play-circle"
                          size={80}
                          color={colours.accent}
                        />
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : null}
          </>
        </LinearGradient>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  albumTitle: {
    color: colours.white,
    fontSize: 20,
    fontWeight: '600',
    paddingTop: 4,
    paddingHorizontal: 20,
    textAlign: 'left',
    fontFamily: 'Inter-Bold',
  },
  artistTitle: {
    color: colours.white,
    fontSize: 16,
    textAlign: 'left',
    paddingTop: 2,
    paddingHorizontal: 20,
    fontFamily: 'Inter-SemiBold',
  },
  genre: {
    color: colours.white,
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 20,
    fontFamily: 'Inter-Regular',
  },
  yearTitle: {
    color: colours.white,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#2a2a2a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    alignSelf: 'center',
  },
  item: {
    padding: 20,
    marginHorizontal: 16,
    alginSelf: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    margin: 6,
    marginHorizontal: sizes.marginListX,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  actionButton: {
    alignSelf: 'center',
    paddingHorizontal: sizes.marginListX / 2,
  },
  playButton: {
    marginRight: width * 0.08,
  },
});

const ListFooter = ({albumItems, item, similarAlbums, navigation}) => {
  const runTime = getHourMinutes(item.RunTimeTicks);
  return (
    <>
      <ListFooterContent
        item={item}
        albumItems={albumItems}
        runTime={runTime}
      />
      <ArtistItems
        screenItem={item}
        items={similarAlbums}
        navigation={navigation}
        session={session}
        text={'Albums'}
      />
    </>
  );
};

class ListFooterContent extends React.PureComponent {
  render() {
    return (
      <View style={listFooterStyle.container}>
        <Text style={listFooterStyle.text}>
          Year {this.props.item.ProductionYear} {'\n'}
          {this.props.albumItems.TotalRecordCount} Tracks • {this.props.runTime}
        </Text>
      </View>
    );
  }
}

const listFooterStyle = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colours.black,
    paddingLeft: sizes.marginListX,
  },
  text: {
    fontSize: sizes.fontSizePrimary,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
    lineHeight: 26,
    fontFamily: 'Inter-SemiBold',
  },
});

type ListRenderItemProps = {
  albumItems: LibraryItemList;
  index: number | false;
  session: Session;
  bitrateLimit: number;
  castService: CastService;
  castClient?: RemoteMediaClient | null;
  currentTrack: number;
};

class ListRenderItem extends React.PureComponent<ListRenderItemProps> {
  render() {
    return (
      <SwipeableRow
        session={this.props.session}
        item={
          this.props.index
            ? this.props.albumItems.Items[this.props.index]
            : this.props.albumItems.Items[0]
        }
        currentTrack={this.props.currentTrack}
        bitrateLimit={this.props.bitrateLimit}
        castClient={this.props.castClient}
        castService={this.props.castService}>
        <View style={listItemStyles.container}>
          <TouchableOpacity
            onPress={async () => {
              if (this.props.castClient !== null) {
                await this.props.castService.playAlbum(
                  this.props.session,
                  this.props.albumItems,
                  this.props.index,
                  this.props.castClient,
                );
              } else {
                await playAudio(
                  this.props.albumItems.Items,
                  this.props.index,
                  this.props.session,
                  this.props.bitrateLimit,
                );
              }
            }}>
            <View style={listItemStyles.containerArtistTitle}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={
                  this.props.isPlaying
                    ? [listItemStyles.songTitle, {color: colours.accent}]
                    : [listItemStyles.songTitle, {color: colours.white}]
                }>
                {this.props.index !== false ? (
                  <>{this.props.index + 1}. </>
                ) : null}
                {this.props.item.Name}
              </Text>
              <View style={listItemStyles.songArtistsContainer}>
                <Text
                  style={
                    this.props.isPlaying
                      ? [listItemStyles.songArtists, {color: colours.accent}]
                      : [listItemStyles.songArtists, {color: colours.white}]
                  }
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {this.props.item.AlbumArtists.map(artist => artist.Name).join(
                    ', ',
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={listItemStyles.menuContainer}>
            <SlideInContextMenu
              mediaItem={this.props.item}
              mediaType={'Song'}
              session={this.props.session}
              screenMode={'ListView'}
            />
          </View>
        </View>
      </SwipeableRow>
    );
  }
}

const listItemStyles = StyleSheet.create({
  container: {flexDirection: 'row'},
  containerArtistTitle: {minWidth: '92%', maxWidth: '92%'},
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  songTitle: {
    fontSize: sizes.fontSizePrimary,
    paddingLeft: sizes.marginListX,
    paddingTop: sizes.marginListY / 2,
    paddingBottom: 2,
    fontFamily: 'Inter-SemiBold',
    flexWrap: 'wrap',
    flex: 1,
  },
  songArtistsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  songArtists: {
    fontSize: sizes.fontSizeSecondary,
    paddingLeft: sizes.marginListX,
    paddingRight: sizes.marginListX,
    paddingBottom: sizes.marginListY / 2,
    color: colours.grey['300'],
    fontFamily: 'Inter-Regular',
  },
});

export {ListHeader, ListRenderItem, ListFooter};
