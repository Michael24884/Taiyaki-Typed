import {AnilistRequestTypes} from '.';
import {StatusInfo} from '../../Views/Components';

export type AnilistStatusTypes = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED';
export type AnilistSeasonsTypes = 'WINTER' | 'FALL' | 'SUMMER' | 'SPRING';
export type AnilistSourceTypes =
  | 'ORIGINAL'
  | 'MANGA'
  | 'LIGHT_NOVEL'
  | 'VISUAL_NOVEL'
  | 'VIDEO_GAME'
  | 'OTHER'
  | 'NOVEL'
  | 'DOUJINSHI'
  | 'ANIME';

export type AnilistCharacterRoleTypes = 'SUPPORTING' | 'MAIN' | 'BACKGROUND';
export type AnilistPagedData = {
  data: {
    Page: {
      pageInfo: PageInfo;
      media: Media[];
    };
  };
  type: AnilistRequestTypes;
};

export type PageInfo = {
  hasNextPage: boolean;
  currentPage: number;
};

export type Media = {
  id: number;
  idMal: string;
  isAdult: boolean;
  description?: string;
  genres: string[];
  meanScore: number;
  format: string;
  popularity: number;
  status: AnilistStatusTypes;
  countryOfOrigin: string;
  hashtag: string;
  source: AnilistSourceTypes;
  duration: number;
  season: AnilistSeasonsTypes;
  seasonYear: number;
  episodes: number;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
  };
  title: {
    romaji: string;
    english?: string;
  };
  coverImage: {
    extraLarge: string;
  };
  bannerImage?: string;
  characters: {
    nodes: AnilistCharacterModel[];
  };
  startDate: AnilistDates;
  endDate: AnilistDates;
  mediaListEntry: AnilistMediaListEntry;
  mappedEntry: StatusInfo;
};

export type AnilistMediaListEntry = {
  progress: number;
  score: number;
  status: string;
  startedAt: AnilistDates;
  completedAt: AnilistDates;
};

export type AnilistCharacterModel = {
  name: {full: string};
  image: {large: string};
  id: number;
};

export type AnilistDates = {
  year?: number;
  day?: number;
  month?: number;
};

export type AnilistViewerModel = {
  data: {
    Viewer: {
      name: string;
      id: number;
      avatar: {large: string};
    };
  };
};

export type AnilistCharacterPageEdgeModel = {
  role: AnilistCharacterRoleTypes;
  node: AnilistCharacterModel;
};
export type AnilistCharacterPageModel = {
  data: {
    Media: {
      characters: {
        pageInfo: PageInfo;
        edges: AnilistCharacterPageEdgeModel[];
      };
    };
  };
};
