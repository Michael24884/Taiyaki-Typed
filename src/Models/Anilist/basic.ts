import {LoginConfigModel} from '../taiyaki';
import {
  AnilistSourceTypes,
  AnilistStatusTypes,
  AnilistGenresTypes,
  AnilistFormatTypes,
  AnilistSortTypes,
  AnilistSeasonsTypes,
} from './requestModels';

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
  | 'Seasonal'
  | 'Character'
  | 'Recommendations'
  | 'Search';

export const AnilistPopularGraph = (index?: number): string => `
query {
	Page(page: ${index ?? 1}, perPage: 15) {
    pageInfo{
      hasNextPage
      currentPage
    }
  	media(sort:POPULARITY_DESC, type: ANIME, isAdult: false) {
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
  	media(sort:TRENDING_DESC, type: ANIME, isAdult: false) {
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
  	media(season:FALL, seasonYear:2020, sort:POPULARITY_DESC type:ANIME, isAdult: false) {
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
      characters(perPage: 12, sort:ROLE) {
        nodes {
          id
          name {
            full
          }
          image{large}
        }
      }
      recommendations(perPage: 12){
        edges {
          node{
            mediaRecommendation{
              id
              title{romaji}
              coverImage{extraLarge}
            }
          }
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

export const AnilistUpdateMediaGraph = (
  id: number,
  score: number,
  progress: number,
  startedAt: string,
  completedAt: string,
  status: string,
): string => `
mutation {
  SaveMediaListEntry(id:${id}, status: ${status} scoreRaw:${score}, progress:${progress}, startedAt:${startedAt}, completedAt: ${completedAt}) {
   id
   progress
   score
   startedAt{month, year, day}
   completedAt{month, year, day}
   status
 }
 }
`;

export const AnilistCharacterPageGraph = (
  id: number,
  page: number = 1,
): string => `
query {
  Media(id:${id}) {
    characters(page: ${page}, perPage: 15, sort:ROLE){
      pageInfo {
        currentPage
        hasNextPage
      }
      edges {
        role
        node {
          name {full}
          id
          image {large}
        }
      }
    }
  }
}
`;

export const AnilistRecommendationPageGraph = (
  id: number,
  page: number = 1,
): string => `
query {
  Media(id: ${id}) {
    recommendations(perPage: 15, page: ${page}){
      pageInfo{
        currentPage
        hasNextPage
      }
      edges {
        node{
          mediaRecommendation{
            id
            title{romaji}
            coverImage{extraLarge}
            bannerImage
            description
          }
        }
      }
    }
  }
}
`;

export const AnilistSearchGraph = (
  query: string,
  page: number = 1,
  genres?: AnilistGenresTypes[],
  seasonYear?: number,
  season?: AnilistSeasonsTypes,
  formats?: AnilistFormatTypes[],
  sort?: AnilistSortTypes,
  status?: AnilistStatusTypes,
  source?: AnilistSourceTypes,
): string => {
  let queryString: string = '';
  if (genres) {
    queryString += `genre_in: [${genres.map((i) => `"${i}"`)}], `;
  }
  if (seasonYear) {
    queryString += `seasonYear: ${seasonYear}, `;
  }
  if (season) {
    queryString += `season: ${season}, `;
  }
  if (formats) {
    queryString += `format_in: [${formats.join(', ')}], `;
  }
  if (sort) {
    queryString += `sort: ${sort}, `;
  }
  if (status) {
    queryString += `status: ${status}, `;
  }
  if (source) {
    queryString += `source: ${source}`;
  }

  return `
  query {
    Page(perPage: 50, page: ${page}) {
      pageInfo{
        hasNextPage
        currentPage
      }
      media(search: "${query}", isAdult: false, type:ANIME, ${queryString}){
        title{romaji}
        id
        coverImage{extraLarge}
        meanScore
      }
    }
  }
  `;
};
