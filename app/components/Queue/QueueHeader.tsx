import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const QueueHeader = ({text}: {text: string}) => {
  return (
    <View>
      <Text style={styles.headerText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {},
});

export {QueueHeader};
