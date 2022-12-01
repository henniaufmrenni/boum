import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {ButtonBoum} from '@boum/components/Settings';
import {colours} from '@boum/constants';
import {useSetBitrateLimit} from '@boum/hooks';
import {Session} from '@boum/types';
import {Picker} from '@react-native-picker/picker';

type Props = {
  session: Session;
};

const BitratePicker = ({session}: Props) => {
  const [mobileLimit, setMobileLimit] = useState<number>(140000000);
  const [wifiLimit, setWifiLimit] = useState<number>(140000000);
  const [successSavingLimit, setSuccessSavingLimit] = useState<boolean>(false);

  useEffect(() => {
    setMobileLimit(session.maxBitrateMobile);
    setWifiLimit(session.maxBitrateWifi);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Select mobile bitrate:</Text>
        <Picker
          selectedValue={mobileLimit}
          onValueChange={itemValue => setMobileLimit(itemValue)}
          enabled={true}
          prompt={'Select mobile bitrate:'}
          itemStyle={styles.picker}>
          <Picker.Item
            label="Direct Streaming"
            value={140000000}
            style={styles.item}
          />
          <Picker.Item label="64 kbps" value={64000} style={styles.item} />
          <Picker.Item label="96 kbps" value={96000} style={styles.item} />
          <Picker.Item label="128 kbps" value={128000} style={styles.item} />
          <Picker.Item label="160 kbps" value={160000} style={styles.item} />
          <Picker.Item label="192 kbps" value={192000} style={styles.item} />
          <Picker.Item label="256 kbps" value={256000} style={styles.item} />
          <Picker.Item label="320 kbps" value={320000} style={styles.item} />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Select Wifi streaming bitrate: </Text>
        <Picker
          selectedValue={wifiLimit}
          onValueChange={itemValue => setWifiLimit(itemValue)}
          prompt={'Select Wifi bitrate:'}
          itemStyle={styles.picker}>
          <Picker.Item
            label="Direct Streaming"
            value={140000000}
            style={styles.item}
          />
          <Picker.Item label="64 kbps" value={64000} style={styles.item} />
          <Picker.Item label="96 kbps" value={96000} style={styles.item} />
          <Picker.Item label="128 kbps" value={128000} style={styles.item} />
          <Picker.Item label="160 kbps" value={160000} style={styles.item} />
          <Picker.Item label="192 kbps" value={192000} style={styles.item} />
          <Picker.Item label="256 kbps" value={256000} style={styles.item} />
          <Picker.Item label="320 kbps" value={320000} style={styles.item} />
        </Picker>
      </View>
      {successSavingLimit ? (
        <>
          <Text style={styles.text}>
            <Icon name="checkmark-circle" size={30} color={colours.green} />
            Success saving limit
          </Text>
        </>
      ) : null}
      <ButtonBoum
        title={'Save bitrate changes'}
        onPress={() => {
          useSetBitrateLimit(
            session,
            wifiLimit,
            mobileLimit,
            session.maxBitrateVideo,
            session.maxBitrateDownloadAudio,
          ).then(() => {
            setSuccessSavingLimit(true);
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    paddingTop: 20,
  },
  text: {
    color: colours.white,
    fontSize: 16,
    paddingBottom: 5,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  pickerContainer: {
    marginBottom: 20,
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

export {BitratePicker};
