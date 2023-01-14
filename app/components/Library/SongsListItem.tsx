import React from 'react';
import {MediaItem, Session} from '@boum/types';
import {styles} from '@boum/components/Search';
import {playTrack} from '@boum/lib/audio';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity, Text} from 'react-native';
import {RemoteMediaClient} from 'react-native-google-cast';
import {CastService} from '@boum/lib/cast';

type SongListItemProps = {
  item: MediaItem;
  session: Session;
  bitrateLimit: number;
  castService: CastService;
  castClient: RemoteMediaClient;
};

class SongListItem extends React.PureComponent<SongListItemProps> {
  render() {
    return (
      <TouchableOpacity
        key={this.props.item.Id}
        onPress={async () => {
          if (this.props.castClient !== null) {
            this.props.castService.playTrack(
              this.props.session,
              this.props.item,
              0,
              this.props.castClient,
            );
          } else {
            await playTrack(
              this.props.item,
              this.props.session,
              this.props.bitrateLimit,
            );
          }
        }}
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
      </TouchableOpacity>
    );
  }
}

export {SongListItem};
