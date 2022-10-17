import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

import {OpenURLButton} from '@boum/components/Generic';
import {
  BitratePicker,
  ButtonBoum,
  LogoutButton,
  OfflineModeSwitch,
  SwitchWithDescription,
} from '@boum/components/Settings';
import {colours, versionBoum} from '@boum/constants';
import {useScanLibrary, useStore} from '@boum/hooks';
import {NavigationProp} from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const SettingsScreen = ({navigation}: Props) => {
  const rawSession = useStore(state => state.session);
  const [refreshLibraryResult, setRefreshLibraryResult] = useState('');
  let session = {
    userId: '',
    accessToken: '',
    username: '',
    hostname: '',
    maxBitrateMobile: 140000000,
    maxBitrateWifi: 140000000,
    deviceId: '',
  };
  rawSession !== null ? (session = JSON.parse(rawSession)) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <SwitchWithDescription
        title={'Streaming'}
        description={
          'Select a bitrate for both streaming over WiFi and mobile data.'
        }>
        <BitratePicker session={session} />
      </SwitchWithDescription>
      <SwitchWithDescription
        title={'Downloads'}
        description="View your downloads and their status.">
        <ButtonBoum
          title={'Go to Downloads'}
          onPress={() => navigation.navigate('Downloads')}
        />
      </SwitchWithDescription>

      <SwitchWithDescription
        title={'Offline Mode'}
        description="Turn on offline mode to only see the albums on your home screen which you've downloaded">
        <OfflineModeSwitch />
      </SwitchWithDescription>
      <SwitchWithDescription
        title={'Session'}
        description={`You're currently logged in as ${session.username} on ${session.hostname}.`}>
        <ButtonBoum
          title={'Scan Music Libraries'}
          onPress={async () => {
            const res = await useScanLibrary(session);
            setRefreshLibraryResult(res);
          }}
        />

        {refreshLibraryResult !== '' ? (
          <Text style={styles.text}>{refreshLibraryResult}</Text>
        ) : null}
        <LogoutButton />
      </SwitchWithDescription>
      <SwitchWithDescription
        title="License"
        description={`boum version ${versionBoum}\n © Hendrik Stöldt & contributors \nboum is open-source and licensed under GPL-3.0-only.`}>
        <OpenURLButton
          title="View on Github"
          url="https://github.com/henniaufmrenni/boum"
        />
        <OpenURLButton
          title="View the Documentation"
          url="https://eindm.de/projects/boum"
        />
      </SwitchWithDescription>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  header: {
    color: colours.white,
    fontSize: 32,
    fontFamily: 'Inter-ExtraBold',
    textAlign: 'center',
  },
  text: {
    color: colours.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  picker: {
    width: '70%',
    color: 'white',
    backgroundColor: colours.grey['700'],
  },
});

export {SettingsScreen};
