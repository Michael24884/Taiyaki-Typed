import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useAnilistRequest} from '../../Hooks';
import {
  AnilistPagedData,
  AnilistPopularGraph,
  AnilistRequestTypes,
  AnilistSeasonalGraph,
  AnilistTrendingGraph,
} from '../../Models/Anilist';
import {useTheme} from '../../Stores/theme';
import {MapKeyToPaths, MapRequestsToTitle} from '../../Util';
import {BaseRows} from '../Components';

const DiscoveryScreen = () => {
  const theme = useTheme((_) => _.theme);
  const [data, setData] = useState<AnilistPagedData[]>([]);
  const {
    query: {data: PopularData},
  } = useAnilistRequest<AnilistPagedData>('Popular', AnilistPopularGraph());
  const {
    query: {data: TrendingData},
  } = useAnilistRequest<AnilistPagedData>('Trending', AnilistTrendingGraph());
  const {
    query: {data: SeasonalData},
  } = useAnilistRequest<AnilistPagedData>('Seasonal', AnilistSeasonalGraph());

  useEffect(() => {
    const canAdd = (type: AnilistRequestTypes): boolean => {
      const exists = data.find((i) => i.type === type);
      return exists === undefined;
    };

    if (PopularData && canAdd('Popular'))
      setData((list) => list.concat(PopularData));
    if (TrendingData && canAdd('Trending'))
      setData((list) => list.concat(TrendingData));
    if (SeasonalData && canAdd('Seasonal'))
      setData((list) => list.concat(SeasonalData));
  }, [PopularData, TrendingData, SeasonalData, data]);

  const _renderItem = ({item}: {item: AnilistPagedData}) => {
    const {type} = item;
    const {title, subTitle} = MapRequestsToTitle.get(type)!;
    return (
      <BaseRows
        title={title}
        subtitle={subTitle}
        data={item}
        type={type}
        path={MapKeyToPaths.get(type)!}
      />
    );
  };

  return (
    <>
      <FlatList
        style={{backgroundColor: theme.colors.backgroundColor}}
        data={data}
        renderItem={_renderItem}
        keyExtractor={(item) => item.type}
      />
    </>
  );
};

export default DiscoveryScreen;
