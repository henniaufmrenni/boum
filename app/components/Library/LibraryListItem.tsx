import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {colours} from '@boum/constants';
import {MediaItem, Session} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

type LibraryListItemProps = {
  navigationDestination: string;
  item: MediaItem;
  navigation: NavigationProp<any>;
  session: Session;
};

class LibraryListItem extends React.PureComponent<LibraryListItemProps> {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          // FIXME:  Extract this from the arrow function
          this.props.navigation.push(this.props.navigationDestination, {
            itemId: this.props.item.Id,
            name: this.props.item.Name,
            item: this.props.item,
          });
        }}>
        <View style={styles.container}>
          <FastImage
            source={{
              uri: `${this.props.session.hostname}/Items/${this.props.item.Id}/Images/Primary?fillHeight=200&fillWidth=200&quality=96`,
              headers: {
                Accept: 'image/avif,image/webp,*/*',
              },
            }}
            style={styles.image}
          />
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {this.props.item.Name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: colours.black,
    alignItems: 'center',
  },
  textContainer: {
    paddingRight: 13,
  },
  text: {
    flex: 1,
    color: colours.white,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'left',
    paddingLeft: 14,
  },
  image: {
    width: 45,
    height: 45,
  },
});

export default LibraryListItem;
