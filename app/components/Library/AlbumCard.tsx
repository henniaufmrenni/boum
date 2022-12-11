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
import {MediaItem, NavigationDestination, Session} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

const width = Dimensions.get('window').width;

type AlbumCardProps = {
  item: MediaItem;
  navigation: NavigationProp<any>;
  session: Session;
  navigationDestination: NavigationDestination;
  imageLocation?: string;
};

class AlbumCard extends React.PureComponent<AlbumCardProps> {
  render() {
    return (
      <View style={listRowStyles.container}>
        <TouchableOpacity
          onPress={() => {
            // FIXME:  Extract this from the arrow function
            this.props.navigation.push(this.props.navigationDestination, {
              itemId: this.props.item.Id,
              name: this.props.item.Name,
              item: this.props.item,
            });
          }}>
          <View style={listRowStyles.imageContainer}>
            {this.props.item.Id != null ? (
              <FastImage
                source={{
                  uri: this.props.imageLocation
                    ? 'file://' + this.props.imageLocation
                    : `${this.props.session.hostname}/Items/${this.props.item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                  headers: {
                    Accept: 'image/webp,*/*',
                  },
                }}
                style={listRowStyles.image}
              />
            ) : (
              <View style={listRowStyles.image} />
            )}
          </View>

          <View style={listRowStyles.nameContainer}>
            <Text
              style={listRowStyles.name}
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

const listRowStyles = StyleSheet.create({
  container: {
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

export {AlbumCard};
