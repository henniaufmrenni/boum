import React from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import {colours, sizes} from '@boum/constants';
import {Session, VideoMediaItem} from '@boum/types';

import {NavigationProp} from 'react-navigation';
import SingleItemHeader from '../SingleItemHeader';
import {ScrollView} from 'react-native-gesture-handler';
import {
  getHourMinutes,
  getTimeInHourMinutes,
  handleClick,
} from '@boum/lib/helper';

import {VideoItemCard} from '@boum/components/Video';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {FadeInDown} from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';

const width = Dimensions.get('window').width;

type VideoHeaderProps = {
  item: VideoMediaItem;
  session: Session;
  navigation: NavigationProp<any>;
  averageColorRgb: string;
  similarItems: Object;
};

const VideoHeader = ({
  item,
  session,
  navigation,
  averageColorRgb,
  similarItems,
}: VideoHeaderProps) => {
  return (
    <LinearGradient
      colors={[averageColorRgb, colours.black]}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 0.4}}>
      <>
        <View style={styles.container}>
          <SingleItemHeader navigation={navigation} />
          <Animated.View entering={FadeInDown}>
            <View style={styles.posterContainer}>
              {item.Id != null ? (
                <TouchableOpacity
                  style={[
                    styles.image,
                    {
                      width: width * 0.8 * item.PrimaryImageAspectRatio,
                      height: width * 0.8,
                    },
                  ]}
                  onPress={async () => {
                    await TrackPlayer.pause().then(() => {
                      navigation.navigate('Video', {
                        item: item,
                        session: session,
                      });
                    });
                  }}>
                  <FastImage
                    source={{
                      uri: `${session.hostname}/Items/${item.Id}/Images/Primary?fillHeight=400&fillWidth=400&quality=96`,
                      headers: {
                        Accept: 'image/webp,*/*',
                      },
                    }}
                    style={[
                      {
                        width: width * 0.8 * item.PrimaryImageAspectRatio,
                        height: width * 0.8,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.image} />
              )}
            </View>
          </Animated.View>
          <Animated.View
            style={styles.descriptionContainer}
            entering={FadeInDown}>
            <Text style={styles.title}>{item.Name}</Text>
            <Text style={styles.detailText}>
              {item.CriticRating ? (
                <>
                  <Icon name="star" size={16} color={colours.white} />{' '}
                  {item.CriticRating / 10}
                  {'  '}
                </>
              ) : null}
              {item.CommunityRating ? (
                <>
                  <Icon name="heart" size={16} color={colours.white} />{' '}
                  {item.CommunityRating}
                </>
              ) : null}
            </Text>
            <Text style={styles.detailText}>
              {item.PremiereDate.slice(0, 4)}
              {'    '}
              {getHourMinutes(item.RunTimeTicks)}
              {'    '}Ends at {getTimeInHourMinutes(item.RunTimeTicks / 10000)}
            </Text>
            <Text style={styles.detailText}>
              Director:{' '}
              {item.People.filter(person => person.Role === 'Director').map(
                (person, key) => (
                  <>
                    {person.Name}
                    {item.People.filter(person => person.Role === 'Director')
                      .length >
                    key + 1
                      ? ', '
                      : null}
                  </>
                ),
              )}
            </Text>
            <Text style={styles.detailText}>
              Writer:{' '}
              {item.People.filter(
                person =>
                  person.Role === 'Novel' ||
                  person.Role === 'Writer' ||
                  person.Role === 'Book' ||
                  person.Role === 'Screenplay',
              ).map((person, key) => (
                <>
                  {person.Name}
                  {item.People.filter(
                    person =>
                      person.Role === 'Novel' ||
                      person.Role === 'Writer' ||
                      person.Role === 'Book' ||
                      person.Role === 'Screenplay',
                  ).length >
                  key + 1
                    ? ', '
                    : null}
                </>
              ))}
            </Text>
            {item.Genres ? (
              <View>
                <Text style={styles.detailText}>
                  Genres:{' '}
                  {item.Genres.map((genre, key) => (
                    <>
                      {genre}
                      {item.Genres.length > key + 1 ? ', ' : null}
                    </>
                  ))}
                </Text>
              </View>
            ) : null}
            {item.Taglines !== undefined ? (
              <Text style={styles.tagline}>{item.Taglines[0]}</Text>
            ) : null}
            <Text style={styles.description}>{item.Overview}</Text>
            <View style={styles.externalUrlContainer}>
              {item.ExternalUrls.map((externalUrl, key) => (
                <TouchableOpacity
                  onPress={() => handleClick(externalUrl.Url)}
                  key={externalUrl.Url}>
                  <Text style={styles.externalUrl}>
                    {externalUrl.Name}
                    {item.ExternalUrls.length > key + 1 ? ', ' : null}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.cast}>Cast</Text>
          </Animated.View>
          <ScrollView horizontal={true} style={{marginBottom: 20}}>
            {item.People.filter(
              person =>
                person.Role !== 'Director' &&
                person.Role !== 'Producer' &&
                person.Role !== 'Novel' &&
                person.Role !== 'Writer' &&
                person.Role !== 'Book' &&
                person.Role !== 'Screenplay',
            ).map(person => (
              <VideoItemCard
                item={person}
                session={session}
                key={person.Id}
                navigation={navigation}
              />
            ))}
          </ScrollView>
          {similarItems?.Items !== undefined ? (
            <ScrollView horizontal={true}>
              {similarItems.Items.map(item => (
                <VideoItemCard
                  item={item}
                  session={session}
                  key={item.Id}
                  navigation={navigation}
                />
              ))}
            </ScrollView>
          ) : null}
        </View>
      </>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: width * 0.05,
  },
  text: {
    fontSize: 22,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
  image: {
    width: 300,
    height: 300,
  },
  externalUrlContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tagline: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colours.white,
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  externalUrl: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Inter-Bold',
    color: colours.white,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-',
    color: colours.white,
  },
  posterContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    color: colours.white,
    paddingVertical: 10,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colours.white,
    paddingBottom: 4,
  },
  descriptionContainer: {
    paddingHorizontal: sizes.marginListX,
  },
  cast: {
    fontSize: 22,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
    paddingVertical: 12,
  },
});

export {VideoHeader};
