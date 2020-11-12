export type AnilistRequestTypes =
  | 'Popular'
  | 'Detail'
  | 'Trending'
  | 'Seasonal';

export const AnilistPopularGraph = (index?: number): string => `
query {
	Page(page: ${index ?? 1}, perPage: 15) {
    pageInfo{
      hasNextPage
      currentPage
    }
  	media(sort:POPULARITY_DESC, type: ANIME) {
      id
      idMal
      isAdult
      title{
        romaji
        english
      }
      coverImage{
        extraLarge
      }
    }
  }
}
`;

export const AnilistTrendingGraph = (index?: number): string => `
query {
	Page(page: ${index ?? 1}, perPage: 15) {
    pageInfo{
      hasNextPage
      currentPage
    }
  	media(sort:TRENDING_DESC, type: ANIME) {
      id
      idMal
      isAdult
      title{
        romaji
        english
      }
      coverImage{
        extraLarge
      }
    }
  }
}
`;
//TODO: Change to dynamic values
export const AnilistSeasonalGraph = (index?: number): string => `
query {
	Page(page: ${index ?? 1}, perPage: 15) {
    pageInfo{
      hasNextPage
      currentPage
    }
  	media(season:FALL, seasonYear:2020, sort:POPULARITY_DESC type:ANIME) {
      id
      idMal
      isAdult
      title{
        romaji
        english
      }
      coverImage{
        extraLarge
      }
    }
  }
}
`;
