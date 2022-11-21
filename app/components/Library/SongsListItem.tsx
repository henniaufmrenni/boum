import React from 'react';
import {MediaItem, Session} from '@boum/types';
import {styles} from '@boum/components/Search';
import {playTrack} from '@boum/lib/audio';
import FastImage from 'react-native-fast-image';
import {TouchableHighlight, Text} from 'react-native';

type SongListItemProps = {
  item: MediaItem;
  session: Session;
  bitrateLimit: number;
};

class SongListItem extends React.PureComponent<SongListItemProps> {
  render() {
    return (
      <TouchableHighlight
        key={this.props.item.Id}
        onPress={async () =>
          await playTrack(
            this.props.item,
            this.props.session,
            this.props.bitrateLimit,
          )
        }
        style={styles.resultContainer}>
        <>
          {this.props.item.Id != null ? (
            <FastImage
              source={{
                uri: `${this.props.session.hostname}/Items/${this.props.item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                headers: {
                  Accept: 'image/avif,image/webp,*/*',
                },
              }}
              style={styles.image}
            />
          ) : null}
          <Text style={styles.resultText}>{this.props.item.Name}</Text>
        </>
      </TouchableHighlight>
    );
  }
}

export {SongListItem};
