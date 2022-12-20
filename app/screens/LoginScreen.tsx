import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';
import {useValidateLogin} from '@boum/hooks';
import {boumLogo, colours} from '@boum/constants';
import {login} from '@boum/lib/settings/login';

const width = Dimensions.get('window').width;

const LoginScreen: React.FC = () => {
  const [hostname, onChangeHostname] = useState<string>('');
  const [username, onChangeUsername] = useState<string>('');
  const [password, onChangePassword] = useState<string>('');
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [loginDisabled, setLoginDisabled] = useState<boolean>(true);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  useValidateLogin(
    hostname,
    username,
    isValidUrl,
    setIsValidUrl,
    setLoginDisabled,
  );

  return (
    <View style={styles.container}>
      <FastImage source={{uri: boumLogo}} style={styles.logo} />
      <Text style={styles.text}>Hostname</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeHostname}
        value={hostname}
        autoCapitalize={'none'}
        placeholder={'http://192.168.0.1:8096'}
        autoCorrect={false}
        keyboardType={'url'}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'hostname input'}
      />
      {!isValidUrl && hostname.length >= 8 ? (
        <Text style={styles.errorText}>
          Hostname must contain http:// or https://
        </Text>
      ) : null}
      <Text style={styles.text}>Username</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder={'Username'}
        autoCorrect={false}
        autoCapitalize={'none'}
        keyboardType={'default'}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'username input'}
      />
      <Text style={styles.text}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder={'Password'}
        autoCapitalize={'none'}
        autoCorrect={false}
        secureTextEntry={true}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'password input'}
      />
      <ButtonBoum
        onPress={async () => {
          await login(hostname, username, password, setLoginStatus).then(res =>
            console.log(res),
          );
          setLoginDisabled(true);
        }}
        title={'Login'}
        isDisabled={loginDisabled}
      />
      <Text style={styles.text}>{loginStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colours.white,
    fontSize: 35,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    paddingBottom: 10,
  },
  text: {
    color: colours.white,
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  input: {
    height: 45,
    fontSize: 16,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    borderColor: colours.grey['500'],
    color: colours.white,
    fontFamily: 'Inter-Medium',
    padding: 10,
    borderRadius: 7,
  },
  button: {
    color: colours.white,
    paddingTop: 10,
    fontSize: 30,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    marginBottom: 40,
    resizeMode: 'contain',
  },
});

export {LoginScreen};
