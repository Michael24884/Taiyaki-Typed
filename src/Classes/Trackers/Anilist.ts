import {TaiyakiUserModel} from '../../Models/taiyaki';
import {TrackerBase} from './Trackers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnilistViewerGraph, AnilistViewerModel} from '../../Models/Anilist';
import {useUserProfiles} from '../../Stores';

export class AnilistBase implements TrackerBase {
  private baseUrl: string = 'https://graphql.anilist.co';

  async getData(): Promise<TaiyakiUserModel> {
    const file = await AsyncStorage.getItem('auth');
    if (file) {
      const json = JSON.parse(file) as TaiyakiUserModel[];
      const user = json.find((i) => i.source === 'Anilist');
      return user!;
    } else
      throw new Error(
        'Not possible to fetch user data, something might be corrupted',
      );
  }

  async fetchProfile(): Promise<void> {
    const userData = await this.getData();
    const headers = {
      Authorization: 'Bearer ' + userData.bearerToken,
      'Content-Type': 'application/json',
    };
    const request = await fetch(this.baseUrl, {
      headers,
      method: 'POST',
      body: JSON.stringify({query: AnilistViewerGraph}),
    });
    const json = (await request.json()) as AnilistViewerModel;
    const profileStore = useUserProfiles
      .getState()
      .profiles.find((i) => i.source === 'Anilist');
    const {name, id, avatar} = json.data.Viewer;
    profileStore!.profile = {username: name, id, image: avatar.large};
    useUserProfiles
      .getState()
      .removeProfile('Anilist')
      .then(() => useUserProfiles.getState().addToProfile(profileStore!));
  }

  updateStatus(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
