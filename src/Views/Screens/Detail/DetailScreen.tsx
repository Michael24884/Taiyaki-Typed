/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  LogBox,
  Platform,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {FlatList} from 'react-native-gesture-handler';
import {StretchyScrollView} from 'react-native-stretchy';
import {useAnilistRequest, useDetailedHook} from '../../../Hooks';
import {
  AnilistCharacterModel,
  AnilistDetailedGraph,
  AnilistRecommendationPageEdgeModel,
  AnilistRecommendationPageModel,
  Media,
} from '../../../Models/Anilist';
import {useTheme} from '../../../Stores';
import {
  dateNumToString,
  MapAnilistSeasonsToString,
  MapAnilistSourceToString,
  MapAnilistStatusToString,
} from '../../../Util';
import {
  BaseCards,
  BindTitleBlock,
  DangoImage,
  Divider,
  TaiyakiHeader,
  ThemedButton,
  ThemedCard,
  ThemedSurface,
  ThemedText,
  WatchTile,
} from '../../Components';
import {SynopsisExpander} from '../../Components/header';
import ViewPager from '@react-native-community/viewpager';
import StatusPage from './StatusPage';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {DetailedDatabaseModel} from '../../../Models/taiyaki';
import {useQueueStore, useUpNextStore} from '../../../Stores/queue';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = height * 0.26;

interface Props {
  route: {params: {id: number; embedLink?: string}};
}

LogBox.ignoreLogs(['Aborted']);

const DetailScreen: FC<Props> = (props) => {
  const {id} = props.route.params;
  const navigation = useNavigation();
  const scrollValue = useRef(new Animated.Value(0)).current;
  const theme = useTheme((_) => _.theme);

  const [database, setDatabase] = useState<DetailedDatabaseModel>();

  const {
    query: {data},
    controller,
  } = useAnilistRequest<{data: {Media: Media}}>(
    'Detailed' + id.toString(),
    AnilistDetailedGraph(id),
  );

  // const {
  //   query: {data: SimklEpisodeData},
  //   controller: SimklEpisodeController,
  // } = useSimklRequests<SimklEpisodes[]>(
  //   'simkl' + id,
  //   '/anime/episodes/',
  //   data?.data.Media.idMal,
  //   database !== undefined && database.link !== undefined,
  // );

  const detailedHook = useDetailedHook(id, database, data?.data.Media.idMal);
  const addUpNext = useUpNextStore((_) => _.addAll);
  const queueLength = useQueueStore((_) => _.queueLength);

  const {getItem, mergeItem} = useAsyncStorage(id.toString());

  const getDatabase = useCallback(async () => {
    const file = await getItem();
    if (file) {
      const model = JSON.parse(file) as DetailedDatabaseModel;
      setDatabase(model);
    }
  }, []);

  useEffect(() => {
    getDatabase();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: data?.data.Media.title.romaji ?? ' ',
    });
  }, [navigation, data]);

  const opacity = scrollValue.interpolate({
    inputRange: [0, height * 0.4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (props.route.params.embedLink) {
      mergeItem(
        JSON.stringify({
          title: data?.data.Media.title.romaji,
          coverImage: data?.data.Media.coverImage.extraLarge,
        }),
      ).finally(getDatabase);
    }
  }, [props.route.params.embedLink]);

  const AnimatedHeader = Animated.createAnimatedComponent(TaiyakiHeader);

  const styles = StyleSheet.create({
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowView: {flexDirection: 'row'},
    titleView: {
      paddingHorizontal: width * 0.02,
      paddingTop: 10,
      marginBottom: height * 0.03,
      flexShrink: 0.8,
      height: height * 0.14,
    },
    scroller: {
      flex: 1,
      // transform: [{translateY: -height * 0.13}],
    },
    surface: {
      backgroundColor: theme.colors.backgroundColor,
      marginHorizontal: width * 0.025,
      paddingHorizontal: width * 0.03,
      borderRadius: 4,
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
      }),
      paddingBottom: 5,
      marginBottom: height * 0.022,
    },
    subTitle: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: height * 0.01,
      marginBottom: height * 0.02,
    },
    shadowView: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: -1, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
      }),
      // position: 'absolute',
      marginTop: -height * 0.07,
      marginLeft: width * 0.04,
    },
    image: {
      width: width * 0.34,
      height: height * 0.21,
    },
    title: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    englishTitle: {
      color: 'grey',
      fontSize: 13,
      fontWeight: '400',
    },
    synopsis: {
      fontSize: 13,
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genrePills: {
      margin: 4,
      backgroundColor: theme.colors.accent,
      borderRadius: 4,
      justifyContent: 'center',
      padding: 8,
    },
    genreText: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    infoRowView: {
      justifyContent: 'space-around',
    },
    infoRowTitle: {
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '700',
      color: 'grey',
    },
    infoRowData: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'grey',
      marginVertical: 4,
    },
    infoParentChildWrap: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 15,
    },
    imageItems: {
      height: height * 0.26,
      width: width * 0.34,
      marginHorizontal: width * 0.02,
      marginBottom: 5,
    },
    titleItems: {
      fontSize: 14,
      marginTop: 8,
    },
  });

  //Save the simkl id if its missing from the database
  useEffect(() => {
    const saveIDS = async () => {
      if (detailedHook && detailedHook.ids && database && !database.ids.simkl) {
        await mergeItem(JSON.stringify({ids: detailedHook.ids}));
        setDatabase((database) => {
          if (database) {
            database.ids = {...database.ids, ...detailedHook.ids};
            return database;
          }
        });
      }
    };
    saveIDS();
  }, [detailedHook]);

  if (!data)
    return (
      <ThemedSurface
        style={[styles.empty, {backgroundColor: theme.colors.backgroundColor}]}>
        <ActivityIndicator />
      </ThemedSurface>
    );

  const IconRow = (name: string | number, data: string) => {
    return (
      <View style={{justifyContent: 'space-between', alignItems: 'center'}}>
        {typeof name === 'string' ? (
          <Icon name={name} type={'MaterialIcons'} color={'grey'} size={30} />
        ) : (
          <ThemedText
            shouldShrink
            numberOfLines={1}
            style={styles.infoRowTitle}>
            {(name ?? 'N/A').toString()}
          </ThemedText>
        )}
        <ThemedText style={styles.infoRowData}>{data}</ThemedText>
      </View>
    );
  };

  const InfoParentChild = (title: string, data: string) => {
    return (
      <View
        style={{
          width: width * 0.27,
          height: height * 0.05,
          marginHorizontal: width * 0.01,
          marginVertical: height * 0.016,
        }}>
        <ThemedText style={{textAlign: 'center', fontSize: 13}}>
          {title}
        </ThemedText>
        <ThemedText
          style={{
            textAlign: 'center',
            marginTop: 4,
            color: 'grey',
            fontSize: 13,
          }}>
          {data ?? 'N/A'}
        </ThemedText>
      </View>
    );
  };

  const _renderCharacters = ({item}: {item: AnilistCharacterModel}) => {
    const {name, image, id} = item;
    return (
      <View style={[styles.imageItems]}>
        <DangoImage url={image.large} style={{height: '74%', width: '100%'}} />
        <ThemedText style={styles.titleItems} numberOfLines={2}>
          {name.full}
        </ThemedText>
      </View>
    );
  };
  const _renderRec = ({item}: {item: AnilistRecommendationPageEdgeModel}) => {
    const {title, coverImage, id} = item.node.mediaRecommendation;
    return (
      <BaseCards image={coverImage.extraLarge} title={title.romaji} id={id} />
    );
  };

  const {
    bannerImage,
    coverImage,
    title,
    description,
    genres,
    idMal,
    status,
    episodes,
    meanScore,
    format,
    popularity,
    source,
    hashtag,
    countryOfOrigin,
    duration,
    season,
    seasonYear,
    characters,
    recommendations,
    startDate,
    endDate,
    nextAiringEpisode,
    mappedEntry,
  } = data.data.Media;

  const PageOne = () => (
    <StretchyScrollView
      backgroundColor={theme.colors.backgroundColor}
      image={
        bannerImage
          ? {uri: bannerImage}
          : require('../../../assets/images/icon_round.png')
      }
      imageHeight={height * 0.3}
      imageResizeMode={'cover'}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={(position) => scrollValue.setValue(position)}>
      <View>
        <View style={styles.rowView}>
          <View style={styles.shadowView}>
            <DangoImage url={coverImage.extraLarge} style={styles.image} />
          </View>
          <View
            style={[
              styles.titleView,
              // {backgroundColor: theme.colors.backgroundColor},
            ]}>
            <ThemedText shouldShrink numberOfLines={3} style={styles.title}>
              {title.romaji}
            </ThemedText>
            {title.english ? (
              <ThemedText
                shouldShrink
                style={styles.englishTitle}
                numberOfLines={3}>
                {title.english}
              </ThemedText>
            ) : null}
          </View>
        </View>
        {/* //Synopsis */}
        <SynopsisExpander
          synopsis={description}
          nextAiringEpisode={nextAiringEpisode}
        />
        {/* //Bind or Episode */}
        {!database || !database.link ? (
          <BindTitleBlock title={title.romaji} id={id} />
        ) : detailedHook ? (
          !detailedHook.error ? (
            <WatchTile
              episode={
                detailedHook.data.find(
                  (i) =>
                    i.episode === (database.lastWatching?.data?.episode ?? 1),
                ) ?? detailedHook.data.splice(-1)[0]
              }
              detail={database}
              onPress={() => {
                navigation.navigate('EpisodesList', {
                  episodes: detailedHook.data,
                  database: database,
                });
              }}
              onPlay={() => {
                if (queueLength === 0) addUpNext(detailedHook.data);
                // MOVE TO VIDEO PAGE
              }}
              isFollowing={database?.isFollowing}
              onFollow={async (following) => {
                setDatabase((database) => {
                  if (database) return {...database, isFollowing: following};
                });
                await mergeItem(JSON.stringify({isFollowing: following}));
              }}
            />
          ) : (
            <ThemedCard style={{padding: 8}}>
              <ThemedText
                style={{fontWeight: '700', textAlign: 'center', fontSize: 18}}>
                An error has occured. Reason:
              </ThemedText>
              <ThemedText
                style={{fontWeight: '700', textAlign: 'center', fontSize: 16}}>
                {detailedHook.error}
              </ThemedText>
              <ThemedButton
                title={'Retry'}
                onPress={detailedHook.retry}
                color={'red'}
              />
            </ThemedCard>
          )
        ) : null}

        {/* //Genres */}
        <View style={styles.surface}>
          <ThemedText style={styles.subTitle}>Genres</ThemedText>
          <View style={styles.genresContainer}>
            {genres.map((i) => (
              <View key={i} style={styles.genrePills}>
                <ThemedText style={styles.genreText}>{i}</ThemedText>
              </View>
            ))}
          </View>
        </View>
        {/* //More Info */}
        <View style={styles.surface}>
          <ThemedText style={styles.subTitle}>More Information</ThemedText>
          <View style={[styles.rowView, styles.infoRowView]}>
            {IconRow(Number((meanScore * 0.1).toFixed(1)), 'Mean')}
            {IconRow('new-releases', MapAnilistStatusToString.get(status)!)}
            {IconRow(episodes, episodes === 1 ? 'Episode' : 'Episodes')}
            {IconRow('tv', format)}
          </View>
          <Divider />
          <View style={styles.infoParentChildWrap}>
            {InfoParentChild('Origin Country', countryOfOrigin)}
            {InfoParentChild('Hashtag', hashtag)}
            {InfoParentChild(
              'Source',
              MapAnilistSourceToString.get(source) ?? '???',
            )}
            {InfoParentChild('Duration', `${duration} minutes`)}
            {InfoParentChild('Anime ID', id.toString())}
            {InfoParentChild('Popularity', popularity.toLocaleString())}
            {InfoParentChild(
              'Season',
              (MapAnilistSeasonsToString.get(season) ?? '?') +
                ' ' +
                (seasonYear ?? 'N/A').toString(),
            )}
            {InfoParentChild('Start Date', dateNumToString(startDate))}
            {InfoParentChild('End Date', dateNumToString(endDate))}
          </View>
        </View>
        <View style={[styles.surface]}>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <ThemedText style={styles.subTitle}>Characters</ThemedText>
            <Button
              title={'See All'}
              color={theme.colors.accent}
              onPress={() => navigation.push('Characters', {id})}
            />
          </View>
          <FlatList
            data={characters.nodes}
            renderItem={_renderCharacters}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            contentContainerStyle={{height: ITEM_HEIGHT}}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
        {/* //Recommendations */}
        {recommendations.edges.length > 0 ? (
          <View style={[styles.surface]}>
            <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
              <ThemedText style={styles.subTitle}>Recommendations</ThemedText>
              <Button
                title={'See All'}
                color={theme.colors.accent}
                onPress={() => navigation.push('Recommendations', {id})}
              />
            </View>
            <FlatList
              data={recommendations.edges.filter(
                (i) => i.node.mediaRecommendation,
              )}
              renderItem={_renderRec}
              keyExtractor={(item) =>
                item.node.mediaRecommendation.id.toString()
              }
              horizontal
              contentContainerStyle={{height: ITEM_HEIGHT + 50}}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>
        ) : null}
      </View>
    </StretchyScrollView>
  );

  return (
    <>
      <AnimatedHeader
        onPress={() => navigation.goBack()}
        opacity={opacity}
        color={theme.dark ? theme.colors.card : theme.colors.primary}
        headerColor={theme.colors.text}
      />
      <ViewPager style={{height, width, marginTop: -height * 0.13}}>
        <View style={{flex: 1, marginBottom: height * 0.095}} key={'main'}>
          {PageOne()}
        </View>
        <StatusPage
          banner={bannerImage ?? coverImage.extraLarge}
          key={'status'}
          anilistEntry={mappedEntry}
          idMal={idMal}
          id={id}
          title={title.romaji}
        />
      </ViewPager>
    </>
  );
};

export default DetailScreen;
