import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {AlbumCard} from '@boum/components/Library/AlbumCard';
import {colours, sizes} from '@boum/constants';
import {Session} from '@boum/types';

const width = Dimensions.get('window').width;

type Props = {
  items: object;
  navigation: any;
  text: string;
  session: Session;
};

class SimilarAlbums extends React.Component<Props> {
  render() {
    return (
      <>
        {this.props.items.TotalRecordCount >= 1 ? (
          <>
            <View>
              <Text style={similarAlbums.text}>{this.props.text}</Text>
              <ScrollView style={similarAlbums.container} horizontal={true}>
                {this.props.items.Items.map(album => (
                  <AlbumCard
                    key={album.Id}
                    item={album}
                    navigation={this.props.navigation}
                    session={this.props.session}
                    navigationDestination={'Album'}
                  />
                ))}
              </ScrollView>
            </View>
          </>
        ) : null}
      </>
    );
  }
}

const similarAlbums = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    maxWidth: width * 0.5,
    paddingTop: width * 0.08,
    paddingBottom: width * 0.05,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    fontSize: 22,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
});

export {SimilarAlbums};
