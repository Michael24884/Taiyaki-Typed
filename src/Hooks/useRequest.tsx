/* eslint-disable no-undef */
import {useState} from 'react';
import {LayoutAnimation, Platform, UIManager} from 'react-native';
import {QueryConfig, useQuery, useInfiniteQuery} from 'react-query';
import {MyAnimeList} from '../Classes/Trackers';
import {
  AnilistCharacterPageGraph,
  AnilistCharacterPageModel,
  AnilistPagedData,
  AnilistPopularGraph,
  AnilistRecommendationPageGraph,
  AnilistRecommendationPageModel,
  AnilistRequestTypes,
  AnilistSeasonalGraph,
  AnilistTrendingGraph,
  Media,
  PageInfo,
} from '../Models/Anilist';
import {MALDetailed} from '../Models/MyAnimeList';
import {SimklEpisodes, SimklIDConversionModel} from '../Models/SIMKL';
import {useUserProfiles} from '../Stores';
import {MapWatchingStatusToNative, simklThumbnails} from '../Util';

if (Platform.OS === 'android')
  if (UIManager.setLayoutAnimationEnabledExperimental)
    UIManager.setLayoutAnimationEnabledExperimental(true);

type RequestConfig = {
  animated?: boolean;
  enabled?: boolean;
};

const defaultConfigs: RequestConfig = {animated: true, enabled: true};

export function useAnilistRequest<T = AnilistPagedData | Media>(
  key: AnilistRequestTypes | string,
  path: string,
  requestConfig: RequestConfig = defaultConfigs,
) {
  const anilistConfig = useUserProfiles((_) => _.profiles).find(
    (i) => i.source === 'Anilist',
  );
  const {animated, enabled} = requestConfig;
  const baseUrl = 'https://graphql.anilist.co';
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  const fetcher = (_: string) => {
    const json = JSON.stringify({query: path});
    const headers: {[key: string]: string} = {
      'Content-Type': 'application/json',
    };
    if (anilistConfig)
      headers['Authorization'] = 'Bearer ' + anilistConfig.bearerToken;
    return fetch(baseUrl, {
      method: 'POST',
      body: json,
      headers,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (key === 'Popular' || key === 'Trending' || key === 'Seasonal') {
          const modifiedData = responseJson as AnilistPagedData;
          modifiedData.type = key;
          modifiedData.data.Page.media.filter((i) => !i.isAdult);
          return modifiedData;
        } else if (key.includes('Detailed')) {
          const json = responseJson as {data: {Media: Media}};
          if (json.data.Media.mediaListEntry) {
            const {
              progress,
              status,
              startedAt,
              completedAt,
              score,
            } = json.data.Media.mediaListEntry;
            let end: string | undefined;
            let start: string | undefined;
            if (startedAt.day && startedAt.month && startedAt.year)
              start =
                startedAt.month + '/' + startedAt.day + '/' + startedAt.year;
            if (completedAt.day && completedAt.month && completedAt.year)
              start =
                completedAt.month +
                '/' +
                completedAt.day +
                '/' +
                completedAt.year;
            json.data.Media.mappedEntry = {
              started: start,
              ended: end,
              progress: progress,
              totalEpisodes: json.data.Media.episodes,
              score: score,
              status: MapWatchingStatusToNative.get(status),
            };
          }
          return json;
        } else return responseJson as T;
      });
  };

  const config: QueryConfig<Media | AnilistPagedData, any> = {
    onSuccess: () => {
      if (animated)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    refetchInterval: Platform.OS === 'android' ? 0 : 3600000,
    staleTime: 25000,
    enabled: enabled,
  };

  return {
    query: useQuery<T>(key, fetcher, config),
    controller,
  };
}
export function useInifiniteAnilistRequest<
  T extends
    | {data: {Page: {pageInfo: PageInfo}}}
    | {data: {Media: {[key: string]: {pageInfo: PageInfo}}}}
>(key: AnilistRequestTypes, id?: number) {
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
      case 'Character':
        return AnilistCharacterPageGraph(id!, index);
      case 'Recommendations':
        return AnilistRecommendationPageGraph(id!, index);
      default:
        throw 'This property does not exist';
    }
  };

  const fetcher = (key: string, page = 0) => {
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

  const keyGen = (): string => {
    if (key === 'Character') return 'characters' + id!;
    if (key === 'Recommendations') return 'recommendations' + id!;
    return key;
  };

  const isMedia = () => {
    if (key === 'Character' || key === 'Recommendations') {
      return true;
    }
    return false;
  };

  return {
    query: useInfiniteQuery<T>(keyGen(), fetcher, {
      onSuccess: () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      },
      getFetchMore: (lastGroup) => {
        if (!lastGroup) return 1;
        if (isMedia()) {
          let dGroup;
          if (key === 'Character') {
            dGroup = (lastGroup as unknown) as AnilistCharacterPageModel;
            if (dGroup.data.Media.characters.pageInfo.hasNextPage)
              return dGroup.data.Media.characters.pageInfo.currentPage + 1;
          } else {
            dGroup = (lastGroup as unknown) as AnilistRecommendationPageModel;
            if (dGroup.data.Media.recommendations.pageInfo.hasNextPage)
              return dGroup.data.Media.recommendations.pageInfo.currentPage + 1;
          }
          return null;
        } else {
          if (lastGroup && lastGroup.data.Page.pageInfo.hasNextPage) {
            return lastGroup.data.Page.pageInfo.currentPage + 1;
          }
        }
        return null;
      },
    }),
    controller,
  };
}

export function useMalRequests<T>(key: string, path: string) {
  const controller = new AbortController();
  const baseUrl = 'https://api.myanimelist.net/v2';
  const [token, setToken] = useState<string | undefined>();
  const user = useUserProfiles((_) => _.profiles).find(
    (i) => i.source === 'MyAnimeList',
  );

  if (user && user.bearerToken) new MyAnimeList().tokenWatch().then(setToken);

  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const fetcher = (_: string) => {
    return fetch(baseUrl + path, {headers})
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (path.startsWith('/anime')) {
          const media = data as MALDetailed;
          if (media.my_list_status) {
            const {
              num_episodes_watched,
              score,
              end_date,
              status,
              start_date,
            } = media.my_list_status;
            media.mappedEntry = {
              progress: num_episodes_watched,
              totalEpisodes: media.num_episodes,
              ended: end_date,
              score: score,
              started: start_date,
              status: MapWatchingStatusToNative.get(status),
            };
          }
          return media;
        }
        const modifiedData = data as T;
        return modifiedData;
      });
  };
  const config: QueryConfig<T | MALDetailed, any> = {
    enabled: token,
    onSuccess: () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
  };

  return {
    query: useQuery<T | MALDetailed>(key, fetcher, config),
    controller,
  };
}

export function useSimklRequests<T>(
  key: string,
  path: string,
  simklID?: number,
  malID?: string,
  requiresConversion = true,
  enabled: boolean = true,
) {
  const baseUrl = 'https://api.simkl.com';
  const controller = new AbortController();
  const headers = {
    'simkl-api-key':
      'b3392816b2f405397aa0721dc2af589e2ed6f71d333abd6200ae19a56d9bc685',
    'Content-Type': 'application/json',
  };
  const [animeID, setAnimeID] = useState<number | undefined>(simklID);

  if (requiresConversion && !animeID && enabled && malID) {
    fetch(baseUrl + '/search/id?mal=' + malID, {headers})
      .then((response) => response.json())
      .then((json: SimklIDConversionModel[]) => {
        setAnimeID(json[0].ids.simkl);
      });
  }

  const fetcher = () => {
    return fetch(baseUrl + path + animeID + '?extended=full', {
      signal: controller.signal,
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (path.includes('/episodes/')) {
          const media = data as SimklEpisodes[];
          media.map((i) => (i.img = simklThumbnails(i.img, 'episode')));
          return media;
        }
        return data;
      });
  };
  const config: QueryConfig<T | SimklEpisodes[], any> = {
    enabled: malID && enabled,
    onSuccess: () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
  };

  return {
    query: useQuery<T | SimklEpisodes[]>([key, animeID], fetcher, config),
    controller,
    ids: {simkl: animeID, myanimelist: Number(malID)},
  };
}
