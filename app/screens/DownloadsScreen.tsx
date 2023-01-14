import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text} from 'react-native';

import {LoadingSpinner} from '@boum/components/Generic';
import DownloadItem from '@boum/components/Settings/DownloadItem';
import {colours, sizes} from '@boum/constants';
import {useGetDownloadItems, useStore} from '@boum/hooks';
import {ButtonBoum} from '@boum/components/Settings';

const width = Dimensions.get('window').width;

const DownloadsScreen: React.FC = () => {
  const {downloadItems, gotDownloadItems} = useGetDownloadItems(true);

  const storageService = useStore.getState().storageService;
  const dbService = useStore.getState().dbService;
  const session = useStore.getState().session;

  // TODO: Make this look nicer
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Downloads</Text>
      <ButtonBoum
        onPress={async () => {
          await storageService.redownloadItems(session);
        }}
        title={'Re-trigger downloads'}
      />
      {downloadItems !== undefined && downloadItems ? (
        <>
          {downloadItems.map(item => (
            <DownloadItem key={item.id} item={item} dbService={dbService} />
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
    flex: 1,
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
