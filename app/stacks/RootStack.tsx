import React from 'react';

import {
  BookScreen,
  DownloadsScreen,
  ListManagerScreen,
  LoginScreen,
  PlayerScreen,
  QueueScreen,
  SettingsScreen,
} from '@boum/screens';
import BottomNavigationStack from '@boum/stacks/BottomNavigationStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = () => {
  const RootStack = createNativeStackNavigator();
  return (
    <>
      <RootStack.Navigator
        initialRouteName="BottomNavigationStack"
        screenOptions={{animation: 'none', headerShown: false}}>
        <RootStack.Screen
          name="BottomNavigationStack"
          component={BottomNavigationStack}
        />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
        <RootStack.Screen name="Player" component={PlayerScreen} />
        <RootStack.Screen name="Queue" component={QueueScreen} />
        <RootStack.Screen name="Downloads" component={DownloadsScreen} />
        <RootStack.Screen name="Book" component={BookScreen} />
        <RootStack.Screen name="ListManager" component={ListManagerScreen} />
      </RootStack.Navigator>
    </>
  );
};

export default RootStack;
