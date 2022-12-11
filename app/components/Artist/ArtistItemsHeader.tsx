import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {colours, sizes} from '@boum/constants';

const width = Dimensions.get('window').width;

type ArtistItemsHeaderProps = {
  text: string;
};

class ArtistItemsHeader extends React.PureComponent<ArtistItemsHeaderProps> {
  render() {
    return (
      <View style={artistItemsHeaderStyle.container}>
        <Text style={artistItemsHeaderStyle.text}>{this.props.text}</Text>
      </View>
    );
  }
}

const artistItemsHeaderStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.5,
    maxWidth: width * 0.5,
    paddingBottom: width * 0.05,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
  },
  text: {
    fontSize: 22,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
});

export {ArtistItemsHeader};
