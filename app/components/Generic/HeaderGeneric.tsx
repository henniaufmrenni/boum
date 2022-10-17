import React from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colours} from '@boum/constants';
import {useNavigation} from '@react-navigation/native';

type symbols = 'ios-chevron-down' | 'ios-chevron-back';

type HeaderGenericProps = {
  Symbol: symbols;
  Text: string;
};

const HeaderGeneric: React.FC<HeaderGenericProps> = ({Text, Symbol}) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.container}>
        <TouchableHighlight title="Go Back" onPress={() => navigation.goBack()}>
          <Text>
            <Icon name={Symbol} size={25} color={colours.black} />
          </Text>
        </TouchableHighlight>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  text: {
    color: colours.grey['200'],
    fontSize: 42,
    fontWeight: '100',
    textAlign: 'center',
  },
});

export default HeaderGeneric;
export {HeaderGeneric};
