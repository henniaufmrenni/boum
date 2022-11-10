import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {ButtonBoum} from '@boum/components/Settings';
import {colours} from '@boum/constants';
import {useStore, useStoreEncryptedValue} from '@boum/hooks';
import {SelectedStorageLocation} from '@boum/types';
import {Picker} from '@react-native-picker/picker';

const StorageLocationPicker = () => {
  const [storageLocation, setStorageLocation] =
    useState<SelectedStorageLocation>('DocumentDirectory');
  const [successSavingLimit, setSuccessSavingLimit] = useState<boolean>(false);
  const selectedStorageLocation = useStore(
    state => state.selectedStorageLocation,
  );

  const setSelectedStorageLocation = useStore(
    state => state.setSelectedStorageLocation,
  );

  // TODO: Check whether device has an SD Card
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select storage location:</Text>
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
            <Icon name="checkmark-circle" size={30} color={colours.green} />
            Success saving storage location
          </Text>
        </>
      ) : null}
      <Text style={styles.text}>
        Currently selected storage location:
        {selectedStorageLocation === 'DocumentDirectory'
          ? ' App Directory'
          : selectedStorageLocation === 'DownloadDirectory'
          ? ' Downloads'
          : selectedStorageLocation === 'ExternalDirectory'
          ? ' SD Card'
          : null}
        {'\n'}
        {'\n'}
        If you change the storage location, your previous downloads will remain
        (playable) at their current location.
      </Text>
      {selectedStorageLocation !== 'DocumentDirectory' ? (
        <Text style={styles.text}>
          {'\n'}
          ⚠️ When selecting the downloads folder or SD Card as storage location,
          make sure that you only delete the files from within boum, as it will
          otherwise lead to these tracks not being playable via boum.
        </Text>
      ) : null}
      <ButtonBoum
        title={'Save location changes'}
        onPress={() => {
          useStoreEncryptedValue('selected_storage_location', storageLocation);
          setSelectedStorageLocation(storageLocation);
          setSuccessSavingLimit(true);
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

export {StorageLocationPicker};
