import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {colours, sizes} from '@boum/constants';

const width = Dimensions.get('window').width;

class ArtistItemsRenderItem extends React.PureComponent {
  render() {
    return (
      <View style={artistListItemStyle.container}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.push('Album', {
              itemId: this.props.item.Id,
              name: this.props.item.Name,
              item: this.props.item,
            })
          }>
          <View style={artistListItemStyle.imageContainer}>
            {this.props.item.Id != null ? (
              <FastImage
                source={{
                  uri: `http://10.0.2.2:8096/Items/${this.props.item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                  headers: {
                    Accept: 'image/webp,*/*',
                  },
                }}
                style={artistListItemStyle.image}
              />
            ) : (
              <View style={artistListItemStyle.image} />
            )}
          </View>
          <View style={artistListItemStyle.nameContainer}>
            <Text
              style={artistListItemStyle.name}
              numberOfLines={2}
              ellipsizeMode="tail">
              {this.props.item.Name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const artistListItemStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.5,
    maxWidth: width * 0.5,
    paddingBottom: width * 0.05,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: sizes.fontSizePrimary,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
  image: {
    height: width * 0.4,
    width: width * 0.4,
  },
  songArtistsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default ArtistItemsRenderItem;
