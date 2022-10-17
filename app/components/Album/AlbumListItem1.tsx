import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colours, sizes} from '@boum/constants';
import {playAudio} from '@boum/lib/audio';

type Props = {
  albumItems: Object;
  index: number;
  item: object;
};

class ListRenderItem extends React.PureComponent<Props> {
  render() {
    return (
      <View>
        <Pressable
          title="Play"
          onPressOut={async () =>
            await playAudio(this.props.albumItems.Items, this.props.index)
          }
          style={({pressed}) => [
            {
              backgroundColor: pressed ? colours.grey['800'] : colours.black,
            },
          ]}>
          <Text style={listItemStyles.songTitle}>
            {this.props.index + 1}. {this.props.item.Name}
          </Text>
          <View style={listItemStyles.songArtistsContainer}>
            <Text
              style={listItemStyles.songArtists}
              numberOfLines={1}
              ellipsizeMode="tail">
              {this.props.item.AlbumArtists.map(artist => artist.Name).join(
                ', ',
              )}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }
}

const listItemStyles = StyleSheet.create({
  songTitle: {
    fontSize: sizes.fontSizePrimary,
    fontWeight: sizes.fontWeightPrimary,
    paddingLeft: sizes.marginListX,
    paddingRight: sizes.marginListX,
    paddingTop: sizes.marginListY / 2,
    paddingBottom: 2,
    color: colours.white,
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
    color: colours.grey['200'],
  },
});

export default ListRenderItem;
export {ListRenderItem};
