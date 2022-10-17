import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {colours, sizes} from '@boum/constants';
import {NavigationProp} from '@react-navigation/native';

type NavigationTextProps = {
  text: string;
  navigation: NavigationProp<any>;
  navigationDestination: string;
};

class NavigationText extends React.PureComponent<NavigationTextProps> {
  render() {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(this.props.navigationDestination)
        }
        style={styles.container}>
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  text: {
    fontSize: 36,
    fontWeight: sizes.fontWeightPrimary,
    color: colours.white,
  },
});

export default NavigationText;
