import {LoginConfigModel} from '../taiyaki';

export const AnilistLoginModel: LoginConfigModel = {
  clientId: '2415',
  redirectUri: 'taiyaki://anilist/redirect',
  authUrl:
    'https://anilist.co/api/v2/oauth/authorize?client_id=2415&response_type=token',
};

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

export const AnilistDetailedGraph = (id: number, idMal?: string): string => `
query {
  Media(${idMal ? 'idMal: ' + idMal : 'id: ' + id}) {
      coverImage{extraLarge}
      popularity
      format
      bannerImage
      status
      episodes
      source
      meanScore
      duration
      season
      seasonYear
      id
      idMal
      countryOfOrigin
      title{romaji english}
      description
      hashtag
      genres
      mediaListEntry{
        progress
        score
        status
        startedAt {
          year
          month
          day
        }
        completedAt {
          year
          month
          day
        }
      }
      nextAiringEpisode {
        episode
        timeUntilAiring
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      characters {
        nodes {
          id
          name {
            full
          }
          image{large}
        }
      }
    }
  }
`;

export const AnilistViewerGraph: string = `
query{
  Viewer{
    id
    name
    avatar {large}
  }
}
`;
