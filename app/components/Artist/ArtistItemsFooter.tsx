import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {colours, sizes} from '@boum/constants';
import {getHourMinutes} from '@boum/lib/helper/helper';

const width = Dimensions.get('window').width;

type ArtistItemsFooterProps = {
  artistItems: object;
  item: object;
};

const ArtistItemsFooter: React.FC<ArtistItemsFooterProps> = ({
  artistItems,
  item,
}) => {
  const runTime = getHourMinutes(item.RunTimeTicks);
  return (
    <>
      <ArtistItemsFooterContent
        item={item}
        artistItems={artistItems}
        runTime={runTime}
      />
    </>
  );
};

class ArtistItemsFooterContent extends React.PureComponent {
  render() {
    return (
      <View style={artistItemsFooter.container}>
        <Text style={artistItemsFooter.text}>
          {this.props.artistItems.TotalRecordCount}{' '}
          {this.props.artistItems.TotalRecordCount > 1 ? 'Albums' : 'Album'} •{' '}
          {this.props.runTime}
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
