import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen, DiscoveryScreen, SettingsScreen} from '../Screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../../Stores';
import {TrackerPage} from './Settings';
import GeneralPage from './Settings/general';
import {StatusBar} from 'react-native';
import SearchBindPage from './detailedParts';
import {ArchiveListScreen} from '../Screens/archive_list';
import Icon from 'react-native-dynamic-vector-icons';
import MyQueueScreen from '../Screens/QueuePage';
import EpisodesList from '../Screens/Detail/EpisodesList';
import CharacterListScreen from '../Screens/Detail/ViewMore/CharacterListScreen';

export const Navigator = () => {
  const theme = useTheme((_) => _.theme);
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  function HomeStack() {
    return (
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={DiscoveryScreen} />
        <Stack.Screen name={'BindPage'} component={SearchBindPage} />
        <Stack.Screen name={'EpisodesList'} component={EpisodesList} />
        <Stack.Screen
          name={'Characters'}
          component={CharacterListScreen}
          options={{title: 'All Characters'}}
        />
        <Stack.Screen
          name={'Detail'}
          component={DetailScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name={'MoreItems'} component={MoreItemsScreen} /> */}
      </Stack.Navigator>
    );
  }

  function QueueStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name={'My Queue'} component={MyQueueScreen} />
      </Stack.Navigator>
    );
  }

  function SettingsStack() {
    return (
      <Stack.Navigator initialRouteName={'Settings'}>
        <Stack.Screen name={'Settings'} component={SettingsScreen} />
        <Stack.Screen name={'Trackers'} component={TrackerPage} />
        <Stack.Screen
          name={'GeneralPage'}
          component={GeneralPage}
          options={{title: 'General'}}
        />
        <Stack.Screen
          name={'ArchivePage'}
          component={ArchiveListScreen}
          options={{title: 'Sources'}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        // barStyle={'light-content'}
        backgroundColor={theme.colors.card}
      />
      <NavigationContainer theme={theme}>
        <Tab.Navigator initialRouteName={'Discover'}>
          <Tab.Screen
            name={'Discover'}
            component={HomeStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'google-earth'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name={'Queue'}
            component={QueueStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'animation-play'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name={'Settings'}
            component={SettingsStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'cog'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};
