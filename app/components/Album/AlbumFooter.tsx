import React from 'react';

import {LoadingSpinner} from '@boum/components/Generic';
import ListFooterMetaInformation from '@boum/components/Lists/ListFooterMetaInformation';
import {Session} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

import {SimilarAlbums} from '@boum/components/Album';

type Props = {
  albumItems: Array<object>;
  session: Session;
  item: object;
  similarAlbums: Array<object>;
  navigation: NavigationProp<any>;
};

class AlbumFooter extends React.Component<Props> {
  render() {
    return (
      <>
        <ListFooterMetaInformation
          item={this.props.item}
          albumItems={this.props.albumItems}
        />
        {this.props.similarAlbums ? (
          <SimilarAlbums
            items={this.props.similarAlbums}
            navigation={this.props.navigation}
            session={this.props.session}
            text={'Similar Albums'}
          />
        ) : (
          <LoadingSpinner />
        )}
      </>
    );
  }
}

export {AlbumFooter};
