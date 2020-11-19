import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SimklEpisodes} from '../../../Models/SIMKL';
import {EpisodeTiles, ListRow} from '../../Components';

interface Props {
  route: {params: {episodes: SimklEpisodes[]; title: string}};
}

const EpisodesList: FC<Props> = (props) => {
  const {episodes, title} = props.route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({title: title});
  }, []);

  const _renderItem = ({item}: {item: SimklEpisodes}) => {
    return <EpisodeTiles data={item} counterIndex={2} />;
  };

  return (
    <View style={styles.view}>
      <FlatList
        data={episodes}
        renderItem={_renderItem}
        keyExtractor={(item) => item.episode.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default EpisodesList;
