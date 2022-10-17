import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import SingleItemHeader from '@boum/components/SingleItemHeader';
import {colours, sizes} from '@boum/constants';
import {Session} from '@boum/types';

const width = Dimensions.get('window').width;

type ArtistHeaderProps = {
  artistItems: Array<object>;
  item: object;
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
        {this.props.item.Id != null && this.props.BackdropImageTags !== [] ? (
          <FastImage
            source={{
              uri: `${this.props.session.hostname}/Items/${this.props.item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
              headers: {
                Accept: 'image/webp,*/*',
              },
            }}
            fallback={require('@boum/res/images/placeholder.png')}
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
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alginSelf: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    margin: 6,
    marginLeft: sizes.marginListX,
    marginRight: sizes.marginListX,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ArtistHeader;
