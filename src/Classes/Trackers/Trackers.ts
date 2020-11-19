import {TaiyakiUserModel, WatchingStatus} from '../../Models/taiyaki';

export abstract class TrackerBase {
  abstract getData(): Promise<TaiyakiUserModel>;
  abstract fetchProfile(): Promise<void>;
  abstract updateStatus(
    id: number,
    episodesWatched: number,
    status: WatchingStatus,
    startedAt: Date,
    completedAt: Date,
    totalEpisodes: number,
    score?: number,
  ): Promise<void>;
}
