import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';

import {StyleSheet} from 'react-native';

type VideoDownloadsPickerProps = {
  session: Session;
  item: VideoMediaItem;
};

const VideoDownloadsPicker = ({session, item}: VideoDownloadsPickerProps) => {
  const [selectedBitrate, setSelectedBitrate] = useState<boolean | number>(
    false,
  );

  const {playbackInfo, textStreams, sourceList} = useGetPlaybackInfo(
    session,
    item,
    false,
    maxBitrateVideo,
    0,
  );

  const selectedStorageLocation = useStore(
    state => state.selectedStorageLocation,
  );

  return (
    <Picker
      style={styles.picker}
      selectedValue={selectedBitrate}
      onValueChange={itemValue => {
        selectedBitrate(itemValue);
        useDownloadMovie(session, item, playbackInfo, selectedStorageLocation);
      }}
      prompt={'Select a download quality:'}>
      <Picker.Item label={'Direct'} value={100000000} />
      <Picker.Item label={'20 mbp/s'} value={20000000} />
      <Picker.Item label={'15 mbp/s'} value={15000000} />
      <Picker.Item label={'10 mbp/s'} value={10000000} />
      <Picker.Item label={'6 mbp/s'} value={6000000} />
      <Picker.Item label={'3 mbp/s'} value={3000000} />
      <Picker.Item label={'1 mbp/s'} value={1000000} />
    </Picker>
  );
};
const styles = StyleSheet.create({
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export {VideoDownloadsPicker};
