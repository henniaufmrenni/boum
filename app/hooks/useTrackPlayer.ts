import {useEffect, useState} from 'react';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import {useStore} from '@boum/hooks/useStore';
import {
  getDBConnection,
  readKeyValueData,
  writeKeyValueData,
} from '@boum/lib/db/service';

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

const useTrackPlayer = () => {
  const [initializedQueue, setInitializedQueue] = useState(false);
  const [playerUpdate, setPlayerUpdate] = useState(null);
  const sleepTimer = useStore(state => state.sleepTimer);
  const playerIsSetup = useStore(state => state.playerIsSetup);
  const playbackUpdate = useStore(state => state.playbackUpdate);
  const setPlaybackUpdate = useStore(state => state.setPlaybackUpdate);
  const setSleepTimerState = useStore(state => state.setSleepTimer);

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackTrackChanged) {
      setPlaybackUpdate();
    }
    if (event.type === Event.PlaybackState) {
      setPlayerUpdate(event.state);
    }
  });

  // Track queue and currentTrack state in zustand.
  useEffect(() => {
    async function setCurrentTrack() {
      await TrackPlayer.getCurrentTrack()
        .then(response => {
          useStore.setState({currentTrack: response});
        })
        .catch(error => {
          console.error(error);
        });
      await TrackPlayer.getQueue()
        .then(response => {
          useStore.setState({queue: response});
        })
        .catch(error => {
          console.error(error);
        });
    }
    setCurrentTrack();
  }, [playerUpdate, playbackUpdate]);

  // Retrieve currentTrack and queue from SQLite to initialize
  // the session.
  useEffect(() => {
    async function init() {
      const db = await getDBConnection();
      if (playerIsSetup) {
        const queue = await readKeyValueData(db, 'queue');
        const trackId = await readKeyValueData(db, 'trackId');
        if (queue && trackId) {
          TrackPlayer.add(JSON.parse(queue));
          TrackPlayer.skip(parseInt(trackId));
        }
        setInitializedQueue(true);
      }
    }
    init();
  }, [playerIsSetup]);

  // Persist currentTrack and queue to SQLite.
  useEffect(() => {
    async function saveCurrentTrack() {
      const db = await getDBConnection();
      await TrackPlayer.getCurrentTrack()
        .then(response => {
          writeKeyValueData(db, 'trackId', response);
        })
        .catch(error => {
          console.error(error);
        });
      await TrackPlayer.getQueue()
        .then(response => {
          writeKeyValueData(db, 'queue', response);
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (playerIsSetup && initializedQueue) {
      saveCurrentTrack();
    }
  }, [playbackUpdate]);

  // Sleeptimer
  useEffect(() => {
    if (sleepTimer && sleepTimer <= Date.now()) {
      TrackPlayer.pause();
      setSleepTimerState(0);
    }
  }, [playbackUpdate, playerUpdate]);
};

export {useTrackPlayer};
