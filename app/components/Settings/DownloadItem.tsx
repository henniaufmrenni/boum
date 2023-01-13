import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours} from '@boum/constants';
import {deleteAlbum} from '@boum/lib/settings';
import {DbService} from '@boum/lib/db';

type DownloadItemProps = {
  item: object;
  dbService: DbService;
};

const DownloadItem = ({item, dbService}: DownloadItemProps) => {
  const completedLength = item.children.filter(
    obj => obj.status === 'success',
  ).length;
  const totalLength = item.children.length;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.album}>{item.name}</Text>
          <Text style={styles.artist}>{item.metadata.AlbumArtist}</Text>
        </View>
        {completedLength === totalLength ? (
          <View>
            <Icon name="checkmark-circle" size={30} color={colours.green} />
            <TouchableOpacity
              onPress={async () => await deleteAlbum(item, dbService)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {completedLength !== totalLength ? (
        <>
          <Text styles={styles.text}>
            {`Downloaded ${~~(
              (completedLength / totalLength) *
              100
            )}% | ${totalLength} tracks`}
          </Text>
          <View>
            <ProgressBar duration={totalLength} progress={completedLength} />
            <TouchableOpacity
              onPress={async () => await deleteAlbum(item, dbService)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  album: {
    color: colours.white,
    fontSize: 20,
    fontFamily: 'InterBold',
    maxWidth: '95%',
  },
  artist: {
    color: colours.white,
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    maxWidth: '95%',
  },
  error: {
    textAlign: 'center',
  },
  deleteButton: {
    color: colours.white,
    fontSize: 18,
  },
  text: {
    color: colours.white,
  },
});

type ProgressBarProps = {
  duration: number;
  progress: number;
};

const ProgressBar = ({duration, progress}: ProgressBarProps) => {
  const progressPercentage = progress / duration;

  return (
    <View style={progressStyles.container}>
      <View style={[progressStyles.left, {flex: progressPercentage}]} />
      <View style={[progressStyles.right, {flex: 1 - progressPercentage}]} />
    </View>
  );
};

const progressStyles = StyleSheet.create({
  container: {
    height: 2,
    flexDirection: 'row',
  },
  left: {
    backgroundColor: colours.green,
  },
  right: {
    backgroundColor: colours.white,
  },
});

export default DownloadItem;
