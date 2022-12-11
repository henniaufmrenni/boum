import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {colours, sizes} from '@boum/constants';
import {getHourMinutes} from '@boum/lib/helper/helper';
import {LibraryItemList, MediaItem} from '@boum/types';

const width = Dimensions.get('window').width;

type ArtistItemsFooterProps = {
  item: MediaItem;
  artistItems: LibraryItemList;
};

class ArtistItemsFooter extends React.PureComponent<ArtistItemsFooterProps> {
  runTime = getHourMinutes(this.props.item.RunTimeTicks);

  render() {
    return (
      <View style={artistItemsFooter.container}>
        <Text style={artistItemsFooter.text}>
          {this.props.artistItems.TotalRecordCount}{' '}
          {this.props.artistItems.TotalRecordCount > 1 ? 'Albums' : 'Album'} •{' '}
          {this.runTime}
        </Text>
      </View>
    );
  }
}

const artistItemsFooter = StyleSheet.create({
  container: {
    paddingBottom: width * 0.05,
    backgroundColor: colours.black,
    paddingLeft: sizes.marginListX,
  },
  text: {
    fontSize: sizes.fontSizePrimary,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
    lineHeight: 28,
  },
});

export {ArtistItemsFooter};
