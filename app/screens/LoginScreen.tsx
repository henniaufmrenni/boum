import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import ButtonBoum from '@boum/components/Settings/ButtonBoum';
import {boumLogo, colours} from '@boum/constants';
import {useLogin} from '@boum/hooks';

const width = Dimensions.get('window').width;

const LoginScreen = ({}) => {
  const [hostname, onChangeHostname] = useState<string>('');
  const [username, onChangeUsername] = useState<string>('');
  const [password, onChangePassword] = useState<string>('');

  return (
    <View style={styles.container}>
      <FastImage source={{uri: boumLogo}} style={styles.logo} />
      <Text style={styles.text}>Hostname</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeHostname}
        value={hostname}
        placeholder="http://192.168.0.1:8096"
        autoCorrect={false}
        keyboardType={'url'}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'hostname input'}
      />
      <Text style={styles.text}>Username</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="Username"
        autoCorrect={false}
        keyboardType={'default'}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'username input'}
      />
      <Text style={styles.text}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        autoCorrect={false}
        secureTextEntry={true}
        placeholderTextColor={colours.grey[500]}
        accessibilityLabel={'password input'}
      />
      <ButtonBoum
        onPress={async () =>
          useLogin(hostname, username, password).then(res => console.log(res))
        }
        title={'Login'}
      />
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
