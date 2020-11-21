/* eslint-disable react-native/no-inline-styles */
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Easing,
  Animated,
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {StretchyScrollView} from 'react-native-stretchy';
import {useMalRequests} from '../../../Hooks';
import {MALDetailed} from '../../../Models/MyAnimeList';
import {
  DetailedDatabaseIDSModel,
  TrackingServiceTypes,
} from '../../../Models/taiyaki';

import {useTheme, useUserProfiles} from '../../../Stores';
import {
  DangoImage,
  StatusInfo,
  StatusTiles,
  ThemedButton,
  ThemedText,
} from '../../Components';
import {UpdatingAnimeStatusPage} from '../../Components/detailedParts';

const {height, width} = Dimensions.get('window');

interface Props {
  banner: string;
  anilistEntry?: StatusInfo;
  title: string;
  id: number;
  idMal?: string;
}
const StatusPage: FC<Props> = (props) => {
  const theme = useTheme((_) => _.theme);
  const {banner, anilistEntry, idMal, id, title} = props;
  const profiles = useUserProfiles((_) => _.profiles);
  const controller = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState<boolean>(false);

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

  useEffect(() => {
    _Animate();
  }, [open]);

  const _Animate = () => {
    const Animate: Animated.TimingAnimationConfig = {
      toValue: open ? 1 : 0,
      useNativeDriver: false,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    };
    Animated.timing(controller, Animate).start();
  };

  const animatedImageStyle = controller.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.3, height],
  });

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
            onPress={() => setOpen((open) => !open)}
            title={'Update'}
            style={{alignSelf: 'center'}}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Modal
        visible={open}
        animationType={'slide'}
        hardwareAccelerated
        presentationStyle={'formSheet'}
        onRequestClose={() => setOpen(false)}>
        <View style={{flex: 1}}>
          <UpdatingAnimeStatusPage
            ids={{anilist: id, myanimelist: Number(idMal)}}
          />
        </View>
      </Modal>
      <StretchyScrollView
        image={{uri: banner}}
        imageHeight={height * 0.3}
        scrollEnabled={profiles.length > 0 && !open}
        style={{
          flex: 1,
          marginBottom: height * 0.1,
          backgroundColor: theme.colors.backgroundColor,
        }}>
        {profileRevealer()}
      </StretchyScrollView>
    </View>
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
  blurView: {
    zIndex: 100,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  onBlurTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
    marginTop: height * 0.15,
    textAlign: 'center',
  },
});

export default StatusPage;
