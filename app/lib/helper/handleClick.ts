import {Alert, Linking} from 'react-native';

const handleClick = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Don't know how to open URI: " + url);
    }
  });
};

export {handleClick};
