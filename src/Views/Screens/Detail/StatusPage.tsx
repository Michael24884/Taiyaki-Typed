/* eslint-disable react-native/no-inline-styles */
import React, {FC, useEffect} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {StretchyScrollView} from 'react-native-stretchy';
import {useMalRequests} from '../../../Hooks';
import {AnilistMediaListEntry} from '../../../Models/Anilist';
import {MALDetailed} from '../../../Models/MyAnimeList';
import {TaiyakiUserModel, TrackingServiceTypes} from '../../../Models/taiyaki';
import {useTheme, useUserProfiles} from '../../../Stores';
import {
  StatusInfo,
  StatusTiles,
  ThemedButton,
  ThemedText,
} from '../../Components';

const {height, width} = Dimensions.get('window');

interface Props {
  banner?: string;
  anilistEntry?: StatusInfo;
  idMal: string;
}
const StatusPage: FC<Props> = (props) => {
  const theme = useTheme((_) => _.theme);
  const {banner, anilistEntry, idMal} = props;
  const profiles = useUserProfiles((_) => _.profiles);

  const {
    query: {data: MyAnimeListData},
    controller: MalController,
  } = useMalRequests<MALDetailed>(
    'mal' + idMal,
    '/anime/' + idMal + '?fields={my_list_status},num_episodes',
  );
  useEffect(() => {
    return () => {
      MalController.abort();
    };
  }, [MalController]);

  const _renderMyStatus = (
    tracker: TrackingServiceTypes,
    item?: StatusInfo,
  ) => {
    return <StatusTiles data={item} tracker={tracker} />;
  };

  const profileRevealer = () => {
    if (profiles.length === 0)
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', flex: 1 / 2}}>
          <Icon name={'error'} type={'MaterialIcons'} size={45} color={'red'} />
          <ThemedText
            style={{
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center',
              marginTop: 10,
            }}>
            You're not signed in to any tracking service
          </ThemedText>
        </View>
      );
    return (
      <View>
        {profiles.find((i) => i.source === 'Anilist')
          ? _renderMyStatus('Anilist', anilistEntry)
          : null}
        {profiles.find((i) => i.source === 'MyAnimeList')
          ? _renderMyStatus('MyAnimeList', MyAnimeListData?.mappedEntry)
          : null}
        <View
          style={{
            backgroundColor: theme.colors.backgroundColor,
            marginBottom: 10,
          }}>
          <ThemedText
            style={{
              color: 'grey',
              fontSize: 13,
              fontWeight: '300',
              alignSelf: 'center',
            }}>
            This will update all your sources
          </ThemedText>
          <ThemedButton
            onPress={() => {}}
            title={'Update'}
            style={{alignSelf: 'center'}}
          />
        </View>
      </View>
    );
  };

  return (
    <StretchyScrollView
      image={
        banner
          ? {uri: banner}
          : require('../../../assets/images/icon_round.png')
      }
      imageHeight={height * 0.3}
      scrollEnabled={profiles.length > 0}
      style={{
        marginBottom: height * 0.1,
        backgroundColor: theme.colors.backgroundColor,
      }}>
      {profileRevealer()}
    </StretchyScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    height: height * 0.3,
    width,
    overflow: 'hidden',
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  coverView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});

export default StatusPage;
