import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {ArtistHeader, ArtistItemsFooter} from '@boum/components/Artist';

import AlbumCard from '@boum/components/Lists/AlbumCard';
import {colours, sizes} from '@boum/constants';
import {NavigationDestination, Session} from '@boum/types';

const width = Dimensions.get('window').width;

const ArtistListHeader = ({text}) => {
  return <ArtistListHeaderContent text={text} />;
};

class ArtistListHeaderContent extends React.PureComponent {
  render() {
    return (
      <View style={artistListHeaderStyle.container}>
        <Text style={artistListHeaderStyle.text}>{this.props.text}</Text>
      </View>
    );
  }
}

const artistListHeaderStyle = StyleSheet.create({
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

class ArtistItemsRenderItem extends React.PureComponent {
  render() {
    return (
      <View style={artistListItemStyle.container}>
        <TouchableOpacity
          title="Go to Album"
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

const ArtistItems = ({
  screenItem,
  items,
  navigation,
  text,
  session,
  navigationDestination,
}: {
  screenItem: any;
  items: object;
  navigation: any;
  text: string;
  session: Session;
  navigationDestination: NavigationDestination;
}) => {
  // Convert this to a Flatlist
  // https://reactnative.dev/docs/optimizing-flatlist-configuration#use-getitemlayout
  return (
    <>
      {items !== undefined &&
      items.TotalRecordCount !== undefined &&
      items.TotalRecordCount >= 1 ? (
        <View>
          <>
            <ArtistListHeader text={text} />
            <View style={artistItems.container}>
              {items.Items.map(item => (
                <AlbumCard
                  key={item.Id}
                  item={item}
                  navigation={navigation}
                  navigationDestination={navigationDestination}
                  session={session}
                />
              ))}
            </View>
            <ArtistItemsFooter artistItems={items} item={screenItem} />
          </>
        </View>
      ) : null}
    </>
  );
};

const artistItems = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export {ArtistHeader, ArtistItems, ArtistItemsRenderItem};
