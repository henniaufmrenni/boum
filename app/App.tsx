import React from 'react';
import {Platform, StatusBar, StyleSheet, UIManager} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MenuProvider} from 'react-native-popup-menu';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {LoadingSpinner} from '@boum/components/Generic';
import {colours} from '@boum/constants';
import {
  useInitializeCastClient,
  useInitializeDb,
  useIntializeSession,
  useSetupPlayer,
  useStore,
  useTrackPlayer,
} from '@boum/hooks';
import {LoginScreen} from '@boum/screens';
import RootStack from '@boum/stacks/RootStack';
import {NavigationContainer} from '@react-navigation/native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  useSetupPlayer();
  useTrackPlayer();
  useIntializeSession();
  useInitializeDb();
  useInitializeCastClient();

  const playerIsSetup = useStore(state => state.playerIsSetup);
  const gotLoginStatus = useStore(state => state.gotLoginStatus);
  const session = useStore(state => state.session);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.2)'} />
      <SafeAreaProvider style={{backgroundColor: colours.black}}>
        <MenuProvider backHandler={true}>
          {session?.userId && playerIsSetup ? (
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          ) : gotLoginStatus && playerIsSetup ? (
            <LoginScreen />
          ) : (
            <LoadingSpinner />
          )}
        </MenuProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colours.black},
});

export default App;
