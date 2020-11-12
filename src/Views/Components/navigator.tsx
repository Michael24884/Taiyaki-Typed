import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DiscoveryScreen} from '../Screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../../Stores/theme';

export const Navigator = () => {
  const theme = useTheme((_) => _.theme);
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  function HomeStack() {
    return (
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={DiscoveryScreen} />
        {/* <Stack.Screen name={'MoreItems'} component={MoreItemsScreen} /> */}
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator initialRouteName={'Discover'}>
        <Tab.Screen name={'Discover'} component={HomeStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
