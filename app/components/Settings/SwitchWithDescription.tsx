import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {colours} from '@boum/constants';

const width = Dimensions.get('window').width;

const SwitchWithDescription = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: JSX.Element;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    paddingHorizontal: 12,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonContainer: {alignItems: 'center'},
  title: {
    color: colours.white,
    paddingTop: 20,
    fontSize: 24,
    textAlign: 'left',
    fontFamily: 'Inter-Bold',
    maxWidth: width * 0.8,
  },
  description: {
    color: colours.grey['100'],
    fontSize: 16,
    maxWidth: width * 0.8,
    fontFamily: 'Inter-Regular',
  },
});

export {SwitchWithDescription};
