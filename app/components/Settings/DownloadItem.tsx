import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours} from '@boum/constants';
import {deleteAlbum} from '@boum/lib/settings';

const DownloadItem = ({item}) => {
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
            <TouchableOpacity onPress={async () => await deleteAlbum(item)}>
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
          <ProgressBar duration={totalLength} progress={completedLength} />
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
});

const ProgressBar = ({duration, progress}) => {
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
/*

{"Artists": ["Donald Byrd", "Hank Mobley", "Lee Morgan"], "ChannelId": null, "Id": "973def8474d07d7ed2dfdacb7f6f96bd", "ImageBlurHashes": {"Primary": [Object]}, "ImageTags": {"Primary": "5c7cee51db4b42f6a875b1a616f80578"}, "IsFolder": true, "LocationType": "FileSystem", "Name": "Hank Mobley With Donald Byrd And Lee Morgan", "PremiereDate": "2018-09-28T00:00:00.0000000Z", "PrimaryImageAspectRatio": 1, "ProductionYear": 2018, "RunTimeTicks": 22452932608, "ServerId": "6a12f69590e34cfb99ae55fcf1e16007", "SortName": "hank mobley with donald byrd and lee morgan", "Type": "MusicAlbum", "UserData": {"IsFavorite": false, "Key": "Donald Byrd-Hank Mobley With Donald Byrd And Lee Morgan", "PlayCount": 0, "PlaybackPositionTicks": 0, "Played": false}}, "name": "Hank Mobley With Donald Byrd And Lee Morgan"}

*/
