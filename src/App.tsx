import React, {useEffect} from 'react';
import {useUserProfiles} from './Stores';
import {Navigator} from './Views/Components/navigator';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const initTrackers = useUserProfiles((_) => _.init);

  useEffect(() => {
    initTrackers();
    //AsyncStorage.clear();
    Orientation.lockToPortrait();
  }, [initTrackers]);

  return <Navigator />;
};

export default App;
