import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours, sizes} from '@boum/constants';
import {NavigationProp} from '@react-navigation/native';
import {SlideInContextMenu} from '@boum/components/ContextMenu/ContextMenu';
import {MediaItem, MediaType, ScreenMode, Session} from '@boum/types';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type Props = {
  navigation: NavigationProp<any>;
  contextAction?: () => void;
  mediaItem: MediaItem;
  mediaType: MediaType;
  session?: Session;
  screenMode: ScreenMode;
  listItems?: Array<MediaItem>;
};

class SingleItemHeader extends React.PureComponent<Props> {
  render() {
    return (
      <>
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity
            onPress={this.props.navigation.goBack}
            style={styles.actionButton}>
            <Text>
              <Icon name="ios-arrow-back" size={25} color={colours.white} />
            </Text>
          </TouchableOpacity>
          {this.props.session ? (
            <SlideInContextMenu
              mediaItem={this.props.mediaItem}
              mediaType={this.props.mediaType}
              session={this.props.session}
              screenMode={this.props.screenMode}
              listItems={this.props.listItems}
            />
          ) : null}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  topButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height * 0.06,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
    marginTop: 30,
  },

  actionButton: {
    alignSelf: 'center',
    paddingLeft: sizes.marginListX / 2,
    paddingRight: sizes.marginListX / 2,
  },
});

export default SingleItemHeader;
