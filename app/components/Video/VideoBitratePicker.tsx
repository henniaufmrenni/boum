import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';

import {StyleSheet} from 'react-native';

const VideoBitratePicker = () => {
  const [selectedBitrate, setSelectedBitrate] = useState<boolean | number>(
    false,
  );
  return (
    <Picker
      style={styles.picker}
      selectedValue={selectedBitrate}
      onValueChange={(itemValue, itemIndex) => {
        setSelectedBitrate(itemValue);
      }}>
      <Picker.Item label={'100000'} value={100000} key={100000} />
    </Picker>
  );
};
const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'red',
    color: 'black',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export {VideoBitratePicker};
