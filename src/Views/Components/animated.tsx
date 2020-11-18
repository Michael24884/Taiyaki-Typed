import React, {FC, useEffect, useRef, useState} from 'react';
import {Dimensions, Easing, StyleSheet, View, Animated} from 'react-native';
import {TaiyakiUserModel} from '../../Models/taiyaki';
import {useTheme} from '../../Stores/theme';
import {ThemedText} from './base';
import {Avatars} from './image';

type Marker = {
  image: string;
  name: string;
  source: string;
};

const {height, width} = Dimensions.get('window');

const marker: Marker[] = [
  {
    image:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20710-MMAlTvOqkQEV.jpg',
    name: 'Dumpling24884',
    source: 'Anilist',
  },
  {
    image:
      'https://s4.anilist.co/file/anilistcdn/character/large/b131106-0yYWidr2P00Y.png',
    name: 'Tsukasa Yuzaki',
    source: 'MyAnimeList',
  },
  {
    image:
      'https://s4.anilist.co/file/anilistcdn/character/large/b163011-RQ7w99tKB0ax.png',
    name: 'Ippanjin',
    source: 'SIMKL',
  },
];

export const TransitionedProfilesSmall: FC<{profiles: TaiyakiUserModel[]}> = (
  props,
) => {
  const {profiles} = props;
  const theme = useTheme((_) => _.theme);
  const entranceController = useRef(new Animated.Value(0)).current;
  const textController = useRef(new Animated.Value(0)).current;

  const [currentIndex, setIndex] = useState<number>(0);
  let currentMarker: TaiyakiUserModel = profiles[currentIndex];

  let timer = useRef<NodeJS.Timeout>();

  const Animate = () => {
    Animated.sequence([
      Animated.timing(entranceController, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(textController, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1250,
        easing: Easing.inOut(Easing.circle),
      }),
      Animated.timing(textController, {
        useNativeDriver: true,
        toValue: 0,
        duration: 1250,
        easing: Easing.inOut(Easing.circle),
        delay: 5000,
      }),
      Animated.timing(entranceController, {
        toValue: 2,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start(_onEnd);
  };

  const AnimateSingle = () => {
    Animated.sequence([
      Animated.timing(entranceController, {
        toValue: 1,
        duration: 1500,
        delay: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(textController, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1250,
        easing: Easing.inOut(Easing.circle),
      }),
    ]).start();
  };

  const intoStyle = entranceController.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  const textStyle = textController.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-250, 0, 250],
  });

  const _onEnd = () => {
    entranceController.setValue(0);
    setIndex((indx) => {
      if (indx + 1 > marker.length - 2) return 0;
      return indx + 1;
    });
  };

  //   useEffect(() => {
  //     current
  //   }, [currentIndex])

  //TOOD: Requires crash fix on profile dependency!
  useEffect(() => {
    if (profiles.length === 1) AnimateSingle();
    if (profiles.length > 1) {
      Animate();
      timer.current = setInterval(Animate, 9500);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        styles.smallTransition.view,
        {backgroundColor: theme.colors.backgroundColor},
      ]}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            transform: [
              {
                translateY: intoStyle,
              },
            ],
          },
        ]}>
        <Avatars url={currentMarker.profile?.image} size={55} />
        <View style={{overflow: 'hidden'}}>
          <Animated.View
            style={[
              styles.smallTransition.nameView,
              {transform: [{translateX: textStyle}]},
            ]}>
            <ThemedText style={styles.smallTransition.sourceName}>
              {currentMarker.source}
            </ThemedText>
            <ThemedText style={styles.smallTransition.username}>
              {currentMarker.profile?.username ?? '???'}
            </ThemedText>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = {
  smallTransition: StyleSheet.create({
    view: {
      height: height * 0.08,
      width,
      padding: width * 0.01,
      alignItems: 'center',
      flexDirection: 'row',
      shadowColor: 'black',
      shadowOpacity: 0.25,
      shadowOffset: {width: 0, height: 1},
      shadowRadius: 5,
    },
    nameView: {
      paddingHorizontal: width * 0.03,
    },
    sourceName: {
      fontSize: 13,
      fontWeight: '300',
      color: 'grey',
    },
    username: {
      fontSize: 15,
      fontWeight: '700',
    },
  }),
};
