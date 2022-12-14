import React from 'react';
import {StyleSheet, View} from 'react-native';

import {ArtistItemsFooter, ArtistItemsHeader} from '@boum/components/Artist';
import {AlbumCard} from '@boum/components/Library/AlbumCard';
import {LibraryItemList, NavigationDestination, Session} from '@boum/types';

type ArtistItemsProps = {
  screenItem: any;
  items: LibraryItemList;
  navigation: any;
  text: string;
  session: Session;
  navigationDestination: NavigationDestination;
};

const ArtistItems: React.FC<ArtistItemsProps> = ({
  screenItem,
  items,
  navigation,
  text,
  session,
  navigationDestination,
}) => {
  return (
    <>
      {items !== undefined &&
      items.TotalRecordCount !== undefined &&
      items.TotalRecordCount >= 1 ? (
        <View>
          <>
            <ArtistItemsHeader text={text} />
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

export {ArtistItems};
