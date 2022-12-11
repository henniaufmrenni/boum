import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput} from 'react-native';

import {ButtonBoum} from '@boum/components/Settings';
import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {Session} from '@boum/types';
import {colours} from '@boum/constants';

const width = Dimensions.get('window').width;

type CastSettingsProps = {
  session: Session;
};

const CastSettings: React.FC<CastSettingsProps> = ({session}) => {
  const [chromecastAdress, setChromecastAdress] = useState<string>('');

  const saveChromecastAdress = async () => {
    const newSession = session;
    newSession.chromecastAdress = chromecastAdress;
    console.log(newSession);
    try {
      await storeEncryptedValue(
        'user_session',
        JSON.stringify(newSession),
      ).then(() => {
        useStore.setState({session: JSON.stringify(newSession)});
      });
    } catch (error) {
      return 'Error in saving User session.';
    }
  };

  const saveChromecastAdressEnabled = async () => {
    const newSession = session;
    newSession.chromecastAdressEnabled = !newSession.chromecastAdressEnabled;
    console.log(newSession);
    try {
      await storeEncryptedValue(
        'user_session',
        JSON.stringify(newSession),
      ).then(() => {
        useStore.setState({session: JSON.stringify(newSession)});
      });
    } catch (error) {
      return 'Error in saving User session.';
    }
  };

  return (
    <>
      {session.chromecastAdress ? (
        <Text style={styles.text}>
          Current Chromecast Adress: {session.chromecastAdress}
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        onChangeText={setChromecastAdress}
        value={chromecastAdress}
        autoCapitalize={'none'}
        placeholder={'https://jellyfin.example.com'}
        autoCorrect={false}
        keyboardType={'url'}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'chromecastAdress input'}
      />
      <ButtonBoum
        onPress={saveChromecastAdress}
        title={'Save Chromecast Adress'}
      />
      <ButtonBoum
        onPress={saveChromecastAdressEnabled}
        title={
          (session.chromecastAdressEnabled ? 'Disable ' : 'Enable ') +
          'Chromecast Adress'
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colours.grey['100'],
    fontSize: 16,
    maxWidth: width * 0.8,
    fontFamily: 'Inter-Regular',
  },

  input: {
    height: 45,
    fontSize: 16,
    width: width * 0.8,
    margin: 12,
    borderWidth: 1,
    borderColor: colours.grey['500'],
    color: colours.white,
    fontFamily: 'Inter-Medium',
    padding: 10,
    borderRadius: 7,
  },
});

export {CastSettings};
