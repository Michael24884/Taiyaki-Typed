import {
  AnilistPopularGraph,
  AnilistRequestTypes,
  AnilistSeasonalGraph,
  AnilistTrendingGraph,
} from '../Models/Anilist';

export const MapRequestsToTitle = new Map<
  AnilistRequestTypes,
  {title: string; subTitle: string}
>([
  ['Popular', {title: 'Popular Anime', subTitle: 'Popular by the users'}],
  ['Trending', {title: 'Trending', subTitle: 'Anime on the rise'}],
  ['Seasonal', {title: 'Seasonal', subTitle: 'Fall 2020'}],
]);

export const MapKeyToPaths = new Map<AnilistRequestTypes, string>([
  ['Popular', AnilistPopularGraph()],
  ['Seasonal', AnilistSeasonalGraph()],
  ['Trending', AnilistTrendingGraph()],
]);

export const dynamicMapPaths = (
  key: AnilistRequestTypes,
  index: number,
): string => {
  switch (key) {
    case 'Popular':
      return AnilistPopularGraph(index);
    case 'Seasonal':
      return AnilistSeasonalGraph(index);
    case 'Trending':
      return AnilistTrendingGraph(index);
    case 'Detail':
      return '';
  }
};
