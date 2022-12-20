/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {colours} from '@boum/constants';
import HomeStack from '@boum/stacks/HomeStack';
import LibraryStack from '@boum/stacks/LibraryStack';
import SearchStack from '@boum/stacks/SearchStack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const BottomNavigationStack: React.FC = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        animation: 'none',
        headerShown: false,
        tabBarActiveTintColor: colours.accent,
        tabBarInactiveTintColor: colours.white,
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'ios-home';
          } else if (route.name === 'Library') {
            iconName = 'ios-library';
          } else if (route.name === 'Search') {
            iconName = 'search';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          height: 60,
          paddingHorizontal: 0,
          paddingTop: 0,
          paddingBottom: 5,
          backgroundColor: colours.black,
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Library" component={LibraryStack} />
      <Tab.Screen name="Search" component={SearchStack} />
    </Tab.Navigator>
  );
};

export default BottomNavigationStack;
