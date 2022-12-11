import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {ButtonBoum} from '@boum/components/Settings';
import {colours} from '@boum/constants';
import {
  useSetBitrateLimit,
  useStore,
  useStoreEncryptedValue,
} from '@boum/hooks';
import {SelectedStorageLocation, Session} from '@boum/types';
import {Picker} from '@react-native-picker/picker';

type DownloadSettingsProps = {
  session: Session;
};

const DownloadSettings = ({session}: DownloadSettingsProps) => {
  const [storageLocation, setStorageLocation] =
    useState<SelectedStorageLocation>('DocumentDirectory');
  const [successSavingLimit, setSuccessSavingLimit] = useState<boolean>(false);

  const [downloadQuality, setDownloadQuality] = useState<number>(140000000);

  useEffect(() => {
    setDownloadQuality(session.maxBitrateDownloadAudio);
    setStorageLocation(session.selectedStorageLocation);
  }, []);

  // TODO: Check whether device has an SD Card
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Select a quality for audio downloads:</Text>
        <Picker
          selectedValue={downloadQuality}
          onValueChange={itemValue => setDownloadQuality(itemValue)}
          enabled={true}
          prompt={'Select audio download quality:'}
          itemStyle={styles.picker}>
          <Picker.Item
            label="Direct download"
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
      <Text style={styles.text}>Select a storage location:</Text>
      <Picker
        selectedValue={storageLocation}
        onValueChange={itemValue => {
          setStorageLocation(itemValue);
          setSuccessSavingLimit(false);
        }}
        enabled={true}
        prompt={'Select storage location:'}
        itemStyle={styles.picker}>
        <Picker.Item
          label="App Directory"
          value={'DocumentDirectory'}
          style={styles.item}
        />
        <Picker.Item
          label="Downloads"
          value={'DownloadDirectory'}
          style={styles.item}
        />

        <Picker.Item
          label="SD Card"
          value={'ExternalDirectory'}
          style={styles.item}
        />
      </Picker>
      {successSavingLimit ? (
        <>
          <Text style={styles.text}>
            <Icon name="checkmark-circle" size={25} color={colours.green} />
            Success saving download settings
          </Text>
        </>
      ) : null}
      <Text style={styles.text}>
        If you change the storage location, your previous downloads will remain
        (playable) at their current location.
      </Text>
      {session.selectedStorageLocation !== 'DocumentDirectory' ? (
        <Text style={styles.text}>
          {'\n'}
          ⚠️ When selecting the downloads folder or SD Card as storage location,
          make sure that you only delete the files from within boum, as it will
          otherwise lead to these tracks not being playable via boum.
        </Text>
      ) : null}
      <ButtonBoum
        title={'Save download settings'}
        onPress={() => {
          useSetBitrateLimit(
            session,
            session.maxBitrateWifi,
            session.maxBitrateMobile,
            session.maxBitrateVideo,
            downloadQuality,
            storageLocation,
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
    paddingTop: 5,
    paddingHorizontal: 12,
  },
  text: {
    color: colours.white,
    fontSize: 16,
    paddingVertical: 4,
    textAlign: 'left',
    fontFamily: 'Inter-Regular',
  },
  pickerContainer: {
    paddingVertical: 10,
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

export {DownloadSettings};
