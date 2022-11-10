import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {colours} from '@boum/constants';

const width = Dimensions.get('window').width;

type Props = {
  onPress: () => void;
  title: string;
  isDisabled?: boolean;
};

const ButtonBoum = ({onPress, title, isDisabled}: Props) => {
  return (
    <>
      {isDisabled ? (
        <View style={styles.buttonContainer}>
          <Text style={[styles.buttonText, {color: colours.grey[400]}]}>
            {title}
          </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
          <Text style={[styles.buttonText, {color: colours.white}]}>
            {title}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: width * 0.85,
    height: 50,
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colours.grey['700'],
    backgroundColor: colours.black,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default ButtonBoum;
export {ButtonBoum};
