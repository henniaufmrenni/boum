import React from 'react';
import {StyleSheet, View} from 'react-native';
import RNFS from 'react-native-fs';

import {AlbumCard} from '@boum/components/Library/AlbumCard';
import {useGetDownloadItems} from '@boum/hooks';
import {Session} from '@boum/types';
import {NavigationProp} from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
  session: Session;
};

const OfflineListView = ({navigation, session}: Props) => {
  const items = useGetDownloadItems();

  return (
    <View style={styles.container}>
      {items !== undefined && items.downloadItems.length >= 1
        ? items.downloadItems.map(album => (
            <AlbumCard
              item={album.metadata}
              navigation={navigation}
              session={session}
              navigationDestination={'Album'}
              imageLocation={`file://${album.children[0].imageLocation}`}
              key={album.id}
            />
          ))
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default OfflineListView;
