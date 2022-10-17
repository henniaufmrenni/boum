import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

import {LoadingSpinner} from '@boum/components/Generic';
import DownloadItem from '@boum/components/Settings/DownloadItem';
import {colours, sizes} from '@boum/constants';
import {useGetDownloadItems} from '@boum/hooks';

const DownloadsScreen = ({}) => {
  const downloadItems = useGetDownloadItems();

  // TODO: Make this look nicer and refresh status programatically every few seconds
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Downloads</Text>
      {downloadItems !== undefined && downloadItems ? (
        <>
          {downloadItems.map(item => (
            <DownloadItem key={item.id} item={item} />
          ))}
        </>
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
  text: {
    color: 'white',
    fontSize: 42,
    fontFamily: 'InterBold',
    paddingBottom: sizes.marginListX,
    marginTop: 30,
  },
});

export {DownloadsScreen};
