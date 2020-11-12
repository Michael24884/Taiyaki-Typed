import {LayoutAnimation, Platform, UIManager} from 'react-native';
import {
  QueryConfig,
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryObjectConfig,
} from 'react-query';
import {
  AnilistPagedData,
  AnilistPopularGraph,
  AnilistRequestTypes,
  AnilistSeasonalGraph,
  AnilistTrendingGraph,
  PageInfo,
} from '../Models/Anilist';

if (Platform.OS === 'android')
  if (UIManager.setLayoutAnimationEnabledExperimental)
    UIManager.setLayoutAnimationEnabledExperimental(true);

type RequestConfig = {
  animated: boolean;
};

const defaultConfigs: RequestConfig = {animated: true};

export function useAnilistRequest<T extends AnilistPagedData>(
  key: AnilistRequestTypes | string,
  path: string,
  requestConfig: RequestConfig = defaultConfigs,
) {
  const {animated} = requestConfig;
  const baseUrl = 'https://graphql.anilist.co';
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  const fetcher = (_: string) => {
    const json = JSON.stringify({query: path});
    const headers = {
      'Content-Type': 'application/json',
    };
    return fetch(baseUrl, {
      method: 'POST',
      body: json,
      headers,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const modifiedData = responseJson as T;
        modifiedData.type = key;
        modifiedData.data.Page.media.filter((i) => !i.isAdult);
        return modifiedData;
      });
  };

  const config: QueryConfig<T, any> = {
    onSuccess: () => {
      if (animated)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    refetchInterval: Platform.OS === 'android' ? 0 : 3600000,
  };

  return {
    query: useQuery(key, fetcher, config),
    controller,
  };
}
export function useInifiniteAnilistRequest<
  T extends {data: {Page: {pageInfo: PageInfo}}}
>(key: AnilistRequestTypes) {
  // const {animated} = requestConfig;
  const baseUrl = 'https://graphql.anilist.co';
  // eslint-disable-next-line no-undef
  const controller = new AbortController();

  const switcher = (index: number): string => {
    switch (key) {
      case 'Popular':
        return AnilistPopularGraph(index);
      case 'Seasonal':
        return AnilistSeasonalGraph(index);
      case 'Trending':
        return AnilistTrendingGraph(index);
      default:
        throw 'This property does not exist';
    }
  };

  const fetcher = (key: string, page = 0) => {
    console.log('the pag', page);
    const json = JSON.stringify({query: switcher(page)});
    const headers = {
      'Content-Type': 'application/json',
    };
    return fetch(baseUrl, {
      method: 'POST',
      body: json,
      headers,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => data as T);
  };

  return {
    query: useInfiniteQuery<T>(key, fetcher, {
      getFetchMore: (lastGroup) => {
        if (lastGroup && lastGroup.data.Page.pageInfo.hasNextPage) {
          console.log(
            'has next page',
            lastGroup.data.Page.pageInfo.currentPage + 1,
          );
          return lastGroup.data.Page.pageInfo.currentPage + 1;
        }
        return null;
      },
    }),
    controller,
  };
}
