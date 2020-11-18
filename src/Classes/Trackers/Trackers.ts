import { TaiyakiUserModel } from '../../Models/taiyaki';

export abstract class TrackerBase {
  abstract getData(): Promise<TaiyakiUserModel>;
  abstract fetchProfile(): Promise<void>;
  abstract updateStatus(): Promise<void>;
}
