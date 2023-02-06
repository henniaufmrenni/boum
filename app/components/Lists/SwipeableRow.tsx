import {colours} from '@boum/constants';
import {addAlbumToQueue} from '@boum/lib/audio';
import {CastService} from '@boum/lib/cast';
import {MediaItem, Session} from '@boum/types';
import React, {Component, PropsWithChildren} from 'react';
import {Animated, StyleSheet} from 'react-native';

import {RectButton} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RemoteMediaClient} from 'react-native-google-cast';

type SwipeableRowProps = {
  session: Session;
  item: MediaItem;
  bitrateLimit: number;
  currentTrack: number;
  castClient: RemoteMediaClient | null;
  castService: CastService;
};

class SwipeableRow extends Component<PropsWithChildren<SwipeableRowProps>> {
  private renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{translateX: trans}],
            },
          ]}>
          Play next
        </Animated.Text>
      </RectButton>
    );
  };

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };

  private close = () => {
    this.swipeableRow?.close();
  };

  private addToQueue = async (
    session: Session,
    song: MediaItem,
    bitrateLimit: number,
    currentTrack: number,
    castClient: RemoteMediaClient | null,
    castService: CastService,
  ) => {
    if (castClient !== undefined && castClient !== null) {
      castClient.getMediaStatus().then(status => {
        castService.addTracksToQueue(
          session,
          {
            Items: [song],
            StartIndex: 0,
            TotalRecordCount: 1,
          },
          status?.currentItemId ? status?.currentItemId + 1 : 0,
          castClient,
        );
      });
    } else {
      await addAlbumToQueue([song], session, bitrateLimit, currentTrack + 1);
    }
  };

  render() {
    const {children} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30}
        rightThreshold={40}
        renderLeftActions={this.renderLeftActions}
        onSwipeableOpen={direction => {
          if (direction === 'left') {
            this.addToQueue(
              this.props.session,
              this.props.item,
              this.props.bitrateLimit,
              this.props.currentTrack,
              this.props.castClient,
              this.props.castService,
            );
          }
          this.close();
        }}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: colours.accent,
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export {SwipeableRow};
