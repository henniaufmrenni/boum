import React from 'react';
import {TrackBoum} from '@boum/types';
import {Dimensions, View, Text} from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import {useStore} from '@boum/hooks';
import {CastService} from '@boum/lib/cast';
import {RemoteMediaClient} from 'react-native-google-cast';

const width = Dimensions.get('window').width;

type PlayerImageCarouselProps = {
  currentTrack: number;
  queue: Array<TrackBoum>;
  castClient: RemoteMediaClient | null;
};

const PlayerImageCarousel: React.FC<PlayerImageCarouselProps> = ({
  currentTrack,
  queue,
}) => {
  const repeatMode = useStore(state => state.repeatMode);

  return (
    <View>
      {currentTrack !== undefined && queue !== undefined ? (
        <Carousel
          loop={repeatMode === RepeatMode.Queue ? true : false}
          windowSize={3}
          vertical={false}
          width={width}
          height={width}
          defaultIndex={currentTrack}
          pagingEnabled={true}
          onSnapToItem={index => TrackPlayer.skip(index)}
          snapEnabled={true}
          onProgressChange={(_, absoluteProgress) =>
            (currentTrack = absoluteProgress)
          }
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 0,
            parallaxAdjacentItemScale: 0.9,
          }}
          data={queue}
          renderItem={({item}) => (
            <FastImage
              key={item.id}
              source={{
                uri: item.artwork,
                headers: {
                  Accept: 'image/avif,image/webp,*/*',
                },
                priority: FastImage.priority.normal,
              }}
              style={[
                {
                  width: width * 0.8,
                  height: width * 0.8,
                  marginHorizontal: width * 0.1,
                },
              ]}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        />
      ) : null}
    </View>
  );
};

export {PlayerImageCarousel};
