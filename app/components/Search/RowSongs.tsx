import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {playTrack} from '@boum/lib/audio';

import {styles} from '@boum/components/Search';
import {useBitrateLimit, useStore} from '@boum/hooks';
import {LibraryItemList, MediaItem, Session} from '@boum/types';

type RowSongsProps = {
  songs: LibraryItemList;
  session: Session;
};

const RowSongs: React.FC<RowSongsProps> = ({songs, session}) => {
  const bitrate = useBitrateLimit();
  const castClient = useStore(state => state.castClient);
  const castService = useStore(state => state.castService);

  const playSong = async (item: MediaItem) => {
    if (castClient !== null) {
      castService.playTrack(session, item, 0, castClient);
    } else {
      await playTrack(item, session, bitrate);
    }
  };
  return (
    <>
      <View style={styles.resultsContainer}>
        {songs !== undefined && songs.TotalRecordCount >= 1 ? (
          <>
            <Text style={styles.resultCategoryTitle}>Songs</Text>
            {songs.Items.map(item => (
              <TouchableOpacity
                key={item.Id}
                onPress={() => playSong(item)}
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
              </TouchableOpacity>
            ))}
          </>
        ) : null}
      </View>
    </>
  );
};

export {RowSongs};
