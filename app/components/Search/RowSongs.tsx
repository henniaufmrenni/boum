import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {playTrack} from '@boum/lib/audio';

import {styles} from '@boum/components/Search';

const RowSongs = ({songs, session}) => {
  return (
    <>
      <View style={styles.resultsContainer}>
        {songs !== undefined && songs.TotalRecordCount >= 1 ? (
          <>
            <Text style={styles.resultCategoryTitle}>Songs</Text>
            {songs.Items.map(item => (
              <TouchableHighlight
                key={item.Id}
                onPress={async () => await playTrack(item, session)}
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
                  <Text style={styles.resultText}>{item.Name}</Text>
                </>
              </TouchableHighlight>
            ))}
          </>
        ) : null}
      </View>
    </>
  );
};

export {RowSongs};
