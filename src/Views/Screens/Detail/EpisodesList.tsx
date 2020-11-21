import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SimklEpisodes} from '../../../Models/SIMKL';
import {DetailedDatabaseModel} from '../../../Models/taiyaki';
import {EpisodeTiles} from '../../Components/list_cards';

interface Props {
  route: {params: {episodes: SimklEpisodes[]; database: DetailedDatabaseModel}};
}

const EpisodesList: FC<Props> = (props) => {
  const {episodes, database} = props.route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({title: database.title});
  }, []);

  const _renderItem = ({item}: {item: SimklEpisodes}) => {
    return <EpisodeTiles episode={item} detail={database} />;
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
