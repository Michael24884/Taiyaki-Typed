import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ThemedText} from '../Components';
import {SettingsRow, TaiyakiSettingsHeader} from '../Components/Settings';

const SettingsScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.view}>
      <TaiyakiSettingsHeader />
      <SettingsRow onPress={() => navigation.navigate('GeneralPage')}>
        <ThemedText style={styles.title}>General</ThemedText>
      </SettingsRow>
      <SettingsRow onPress={() => navigation.navigate('Trackers')}>
        <ThemedText style={styles.title}>Trackers</ThemedText>
      </SettingsRow>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SettingsScreen;
