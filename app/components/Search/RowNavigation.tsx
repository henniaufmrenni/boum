import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {styles} from '@boum/components/Search';

const RowNavigation = ({
  albums,
  navigation,
  navigationDestination,
  session,
}) => {
  return (
    <>
      <View style={styles.resultsContainer}>
        {albums !== undefined && albums.TotalRecordCount >= 1 ? (
          <>
            <Text style={styles.resultCategoryTitle}>
              {navigationDestination}
            </Text>
            {albums.Items.map(item => (
              <>
                <TouchableHighlight
                  key={item.Id}
                  onPress={() =>
                    navigation.navigate(navigationDestination, {
                      itemId: item.Id,
                      name: item.Name,
                      item: item,
                    })
                  }
                  style={styles.resultContainer}>
                  <>
                    {item.Id != null ? (
                      <FastImage
                        source={{
                          uri: `${session.hostname}/Items/${item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                          headers: {
                            Accept: 'image/avif,image/webp,*/*',
                          },
                        }}
                        style={styles.image}
                      />
                    ) : null}
                    <Text
                      style={styles.resultText}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {item.Name}
                    </Text>
                  </>
                </TouchableHighlight>
              </>
            ))}
          </>
        ) : null}
      </View>
    </>
  );
};
export {RowNavigation};
