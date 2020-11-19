import {TrackerBase} from '../Classes/Trackers';
import {SimklEpisodes} from './SIMKL';

export type TrackingServiceTypes = 'MyAnimeList' | 'Anilist' | 'SIMKL';
export type SourceTypes = 'vidstreaming' | '4anime' | 'animeowl'

export type TaiyakiUserModel = {
  source: TrackingServiceTypes;
  bearerToken: string;
  refreshToken?: string;
  expiresIn?: Date;
  class: TrackerBase;
  profile: Partial<UserModel>;
};

export type UserModel = {
  username: string;
  image?: string;
  id: number | string;
};

export type LoginConfigModel = {
  authUrl: string;
  tokenUrl?: string;
  redirectUri: string;
  clientId: string;
  clientSecret?: string;
  randomCode?: string;
};

export type WatchingStatus =
  | 'Watching'
  | 'Planning'
  | 'Completed'
  | 'Paused'
  | 'Dropped'
  | 'Add to List';

export type DetailedDatabaseModel = {
  title: string;
  coverImage: string;
  link?: string;
  totalEpisodes: number;
  isFollowing: boolean;
  lastWatching: LastWatchingModel;
  source: TaiyakiArchiveModel;
  ids: DetailedDatabaseIDSModel;
};

export type MyQueueModel = {
  detail: DetailedDatabaseModel;
  episode: SimklEpisodes;
};

export type DetailedDatabaseIDSModel = Partial<{
  anilist: number;
  simkl?: number;
  myanimelist: number;
}>;

export type LastWatchingModel = {
  data: SimklEpisodes;
  progress?: number;
};

export type TaiyakiArchiveModel = {
  name: string;
  imageURL: string | null;
  developer?: string;
  description?: string;
  hasOptions: boolean;
  userOptions?: {};
  requiredOptions?: {
    id: string;
    requiresAuth: boolean;
    displaysWebview: boolean;
  };
  language: string;
  url: string;
  extraDataTitles: string;
  searchTitles: string;
  scrapeEpisodes: string;
  scrapeLinks: string;
  version: string;
  contraVersion: number;
  baseUrl: string;
  hasCloudflare: boolean;
  headers: {[key: string]: string};
};

export type TaiyakiScrapedTitleModel = {
  title: string;
  image?: string;
  embedLink: string;
};
