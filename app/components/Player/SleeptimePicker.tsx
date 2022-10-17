import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colours} from '@boum/constants';
import {useStore} from '@boum/hooks';
import {Picker} from '@react-native-picker/picker';

const SleeptimePicker = () => {
  const setSleepTimerState = useStore(state => state.setSleepTimer);

  const setSleeptimer = (time: number) => {
    const timeNow = Date.now();
    if (time) {
      setSleepTimerState(timeNow + time);
    } else {
      setSleepTimerState(0);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        onValueChange={(itemValue: number) => setSleeptimer(itemValue)}
        enabled={true}
        itemStyle={styles.picker}>
        <Picker.Item
          label="--- Set 
      Sleep Timer ---"
          style={styles.item}
        />
        <Picker.Item label="Turn off" value={false} style={styles.item} />
        <Picker.Item label="5 min" value={300000} style={styles.item} />
        <Picker.Item label="10 min" value={600000} style={styles.item} />
        <Picker.Item label="15 min" value={900000} style={styles.item} />
        <Picker.Item label="20 min" value={1200000} style={styles.item} />
        <Picker.Item label="30 min" value={1800000} style={styles.item} />
        <Picker.Item label="45 min" value={2700000} style={styles.item} />
        <Picker.Item label="1 h" value={3600000} style={styles.item} />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: 'white',
  },
  text: {
    color: colours.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  picker: {
    color: colours.white,
    width: '100%',
  },
  item: {
    color: colours.black,
    backgroundColor: colours.white,
  },
});

export default SleeptimePicker;
