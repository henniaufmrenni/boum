import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import SingleItemHeader from '@boum/components/SingleItemHeader';
import {colours} from '@boum/constants';
import {MediaItem, Session} from '@boum/types';

const width = Dimensions.get('window').width;

type ArtistHeaderProps = {
  artistItems: Array<MediaItem>;
  item: MediaItem;
  session: Session;
  averageColorRgb: string;
  navigation: any;
};

const ArtistHeader: React.FC<ArtistHeaderProps> = ({
  artistItems,
  item,
  session,
  averageColorRgb,
  navigation,
}) => {
  return (
    <>
      {averageColorRgb !== '' ? (
        <LinearGradient
          colors={[averageColorRgb, colours.black]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          <SingleItemHeader navigation={navigation} />
          <ArtistHeaderContent
            artistItems={artistItems}
            item={item}
            session={session}
          />
        </LinearGradient>
      ) : (
        <View>
          <ArtistHeaderContent
            artistItems={artistItems}
            item={item}
            session={session}
          />
        </View>
      )}
    </>
  );
};

class ArtistHeaderContent extends React.PureComponent<ArtistHeaderProps> {
  render() {
    return (
      <>
        {this.props.item.Id != null ? (
          <FastImage
            source={{
              uri: `${this.props.session.hostname}/Items/${this.props.item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
              headers: {
                Accept: 'image/webp,*/*',
              },
            }}
            style={styles.image}
          />
        ) : null}
        <Text style={styles.artistTitle}>{this.props.item.Name}</Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  artistTitle: {
    color: colours.white,
    fontSize: 30,
    fontWeight: '600',
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    fontFamily: 'Inter-ExtraBold',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    alignSelf: 'center',
  },
});

export default ArtistHeader;
