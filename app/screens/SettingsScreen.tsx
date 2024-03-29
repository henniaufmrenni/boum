import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

import {CastSettings} from '@boum/components/Cast';
import {OpenURLButton} from '@boum/components/Generic';
import {
  BitratePicker,
  ButtonBoum,
  DownloadSettings,
  LogoutButton,
  OfflineModeSwitch,
  SwitchWithDescription,
} from '@boum/components/Settings';
import {useStore} from '@boum/hooks';
import {scanLibrary} from '@boum/lib/settings';
import {colours, versionBoum} from '@boum/constants';

type SettingsScreenProps = {
  navigation: NavigationProp<any>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const session = useStore(state => state.session);
  const [refreshLibraryResult, setRefreshLibraryResult] = useState('');

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
        description={'View your downloads and their status.'}>
        <>
          <DownloadSettings session={session} />
          <ButtonBoum
            title={'Go to Downloads'}
            onPress={() => navigation.navigate('Downloads')}
          />
        </>
      </SwitchWithDescription>
      <SwitchWithDescription
        title={'Chromecast'}
        description={'Set up a different adress for Chromecast.'}>
        <CastSettings session={session} />
      </SwitchWithDescription>
      <SwitchWithDescription
        title={'Offline Mode'}
        description={
          "Turn on offline mode to only see the albums on your home screen which you've downloaded."
        }>
        <OfflineModeSwitch session={session} />
      </SwitchWithDescription>
      <SwitchWithDescription
        title={'Custom Lists'}
        description={
          'Manage your existing and create new custom lists for your homescreen.'
        }>
        <ButtonBoum
          title={'Manage Your Lists'}
          onPress={() => navigation.navigate('ListManager')}
        />
      </SwitchWithDescription>
      <SwitchWithDescription
        title={'Session'}
        description={`You're currently logged in as ${session.username} on ${session.hostname}.`}>
        <>
          <ButtonBoum
            title={'Scan Music Libraries'}
            onPress={async () => {
              const res = await scanLibrary(session);
              setRefreshLibraryResult(res);
            }}
          />
          {refreshLibraryResult !== '' ? (
            <Text style={styles.text}>{refreshLibraryResult}</Text>
          ) : null}
          <LogoutButton />
        </>
      </SwitchWithDescription>
      <SwitchWithDescription
        title="License"
        description={`boum version ${versionBoum}\n © Hendrik Stöldt & contributors \nboum is open-source and licensed under MPL-2.0.`}>
        <>
          <OpenURLButton
            title={'View on Github'}
            url={'https://github.com/henniaufmrenni/boum'}
          />
          <OpenURLButton
            title={'View the Documentation'}
            url={'https://eindm.de/projects/boum'}
          />
          <OpenURLButton
            title={'Sponsor'}
            url={'https://github.com/sponsors/henniaufmrenni'}
          />
        </>
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
