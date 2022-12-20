import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text} from 'react-native';
import Pdf from 'react-native-pdf';
import {colours, versionBoum} from '@boum/constants';

import {MediaItem} from '@boum/types';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useStore} from '@boum/hooks';
import {LoadingSpinner} from '@boum/components/Generic';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type BookScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {item: MediaItem}}>;
};

const BookScreen: React.FC<BookScreenProps> = ({route}) => {
  const {item} = route.params;
  const session = useStore(state => state.session);

  const [fileType, setFileType] = useState<undefined | string>(undefined);
  const fileUrl = `${session.hostname}/Items/${item.Id}/Download`;
  const source = {
    uri: fileUrl,
    cache: true,
    headers: {
      'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
    },
  };

  useEffect(() => {
    async function getBookType() {
      await fetch(fileUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Emby-Authorization': `MediaBrowser Client="Boum", DeviceId="${session.deviceId}", Version="${versionBoum}", Token=${session.accessToken}`,
        },
      }).then(async res => {
        console.log(res.headers);
        const contentType = res.headers.get('content-type');
        setFileType(contentType?.slice(12));
      });
    }
    getBookType();
  }, [fileUrl, session]);

  return (
    <SafeAreaView style={styles.container}>
      {fileType === 'pdf' ? (
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={numberOfPages => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={page => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      ) : fileType === undefined ? (
        <LoadingSpinner />
      ) : (
        <Text style={styles.text}>
          Books in {fileType} format are not supported
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: colours.black,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    paddingTop: 30,
    color: colours.white,
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
  },
});

export {BookScreen};
