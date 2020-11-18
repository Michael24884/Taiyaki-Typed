import { StatusInfo } from '../../Views/Components';

export type MALUserModel = {
  id: number;
  name: string;
  picture?: string;
};

export type MALDetailed = {
  id: number;
  num_episodes: number;
  my_list_status?: MALListStatus;
  mappedEntry: StatusInfo;
};

export type MALListStatus = {
  status: string;
  score: number;
  num_episodes_watched: number;
  start_date?: string;
  end_date?: string;
};
