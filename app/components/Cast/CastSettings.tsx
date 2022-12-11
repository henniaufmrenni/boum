import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput} from 'react-native';

import {ButtonBoum} from '@boum/components/Settings';
import {useStore} from '@boum/hooks';
import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';
import {colours} from '@boum/constants';

const width = Dimensions.get('window').width;

const CastSettings: React.FC = () => {
  const session = useStore(state => state.session);
  const [chromecastAdress, setChromecastAdress] = useState<string | null>('');
  const [succesSaving, setSuccessSaving] = useState<number>(0);

  const saveChromecastAdressEnabled = () => {
    session.chromecastAdressEnabled = !session.chromecastAdressEnabled;
    storeEncryptedValue('user_session', JSON.stringify(session))
      .then(() => {
        useStore.setState({session: session});
        setSuccessSaving(succesSaving + 1);
      })
      .catch(err => new Error(err));
  };

  const saveChromecastAdress = () => {
    chromecastAdress === ''
      ? (session.chromecastAdress = null)
      : (session.chromecastAdress = chromecastAdress);
    storeEncryptedValue('user_session', JSON.stringify(session))
      .then(() => {
        useStore.setState({session: session});
        setSuccessSaving(succesSaving + 1);
      })
      .catch(err => new Error(err));
  };

  return (
    <>
      {session.chromecastAdress !== null ? (
        <Text style={styles.text}>
          Current Chromecast Adress: {session.chromecastAdress}
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        onChangeText={url => setChromecastAdress(url)}
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
