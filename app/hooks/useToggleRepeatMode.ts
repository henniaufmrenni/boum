import TrackPlayer, {RepeatMode} from 'react-native-track-player';

const useToggleRepeatMode = async (currentMode: RepeatMode) => {
  if (currentMode === RepeatMode.Off) {
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  } else if (currentMode === RepeatMode.Queue) {
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  } else {
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  }
  const mode = await TrackPlayer.getRepeatMode();
  console.log('Repeat mode set to: ', mode);
  return mode;
};

export {useToggleRepeatMode};
