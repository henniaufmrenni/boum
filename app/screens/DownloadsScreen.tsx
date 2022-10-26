import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text} from 'react-native';

import {LoadingSpinner} from '@boum/components/Generic';
import DownloadItem from '@boum/components/Settings/DownloadItem';
import {colours, sizes} from '@boum/constants';
import {useGetDownloadItems} from '@boum/hooks';
import SingleItemHeader from '@boum/components/SingleItemHeader';

const width = Dimensions.get('window').width;

const DownloadsScreen = ({}) => {
  const {downloadItems, gotDownloadItems} = useGetDownloadItems();

  // TODO: Make this look nicer and refresh status programatically every few seconds
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Downloads</Text>
      {downloadItems !== undefined && downloadItems ? (
        <>
          {downloadItems.map(item => (
            <DownloadItem key={item.id} item={item} />
          ))}
        </>
      ) : gotDownloadItems ? (
        <Text style={styles.text}>You have no downloads</Text>
      ) : (
        <LoadingSpinner />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    flex: 2,
    backgroundColor: colours.black,
    padding: sizes.marginListX,
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontFamily: 'InterBold',
    paddingBottom: sizes.marginListX,
    marginTop: width * 0.05,
    marginLeft: width * 0.02,
  },
  text: {
    color: colours.grey['300'],
    fontSize: 20,
    fontFamily: 'InterBold',
    paddingBottom: sizes.marginListX,
    alignSelf: 'center',
    marginTop: '10%',
  },
});

export {DownloadsScreen};
