/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {
  AnilistPagedData,
  AnilistRequestTypes,
  Media,
} from '../../Models/Anilist';
import {SimklEpisodes} from '../../Models/SIMKL';
import {
  DetailedDatabaseIDSModel,
  DetailedDatabaseModel,
  MyQueueModel,
  TrackingServiceTypes,
  WatchingStatus,
} from '../../Models/taiyaki';
import {useQueueStore, useUpNextStore} from '../../Stores/queue';
import {useTheme} from '../../Stores/theme';
import {
  MapTrackingServiceToAssets,
  MapTrackingServiceToColors,
} from '../../Util';
import {ThemedButton, ThemedCard, ThemedText} from './base';
import DangoImage from './image';

const {height, width} = Dimensions.get('window');

interface BaseCardProps {
  image: string;
  title: string;
  id: number;
}

const _BaseCards: FC<BaseCardProps> = (props) => {
  const {image, title, id} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.push('Detail', {id})}>
      <View style={styles.card.view}>
        <DangoImage url={image} style={styles.card.image} />
        <ThemedText numberOfLines={3} style={styles.card.title}>
          {title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};
export const BaseCards = memo(_BaseCards);

interface BaseRowProps {
  type: AnilistRequestTypes;
  path: string;
  title: string;
  subtitle?: string;
  data: AnilistPagedData;
}

export const BaseRows: FC<BaseRowProps> = (props) => {
  const theme = useTheme((_) => _.theme.colors);
  const ITEM_HEIGHT = height * 0.25;
  const {title, subtitle, data, type} = props;
  const navigation = useNavigation();
  const renderItem = ({item}: {item: Media}) => {
    return (
      <BaseCards
        title={item.title.romaji}
        image={item.coverImage.extraLarge}
        id={item.id}
      />
    );
  };
  return (
    <View style={styles.row.container}>
      <View style={styles.row.titleView}>
        <View>
          <ThemedText style={styles.row.title}>{title}</ThemedText>
          <ThemedText style={styles.row.subTitle}>{subtitle}</ThemedText>
        </View>
        <Button
          title={'See All'}
          onPress={() => navigation.navigate('See More', {key: type})}
          color={theme.accent}
        />
      </View>
      <FlatList
        data={data.data.Page.media}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={{height: ITEM_HEIGHT}}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

export type StatusInfo = {
  status?: WatchingStatus;
  progress: number;
  totalEpisodes: number;
  started?: string;
  ended?: string;
  score?: number;
};
const _StatusTiles: FC<{data?: StatusInfo; tracker: TrackingServiceTypes}> = (
  props,
) => {
  const {tracker} = props;
  if (!props.data) {
    return (
      <View>
        <View style={styles.tiles.emptyView}>
          <Image
            source={MapTrackingServiceToAssets.get(tracker)!}
            style={styles.tiles.assetImage}
          />
          <ThemedText style={styles.tiles.rowTitle}>{tracker}</ThemedText>
        </View>
        <View
          style={{
            backgroundColor: 'red',
            width: '90%',
            alignSelf: 'center',
            padding: height * 0.03,
            borderRadius: 4,
            marginBottom: 15,
          }}>
          <ThemedText style={{color: 'white', fontSize: 18, fontWeight: '700'}}>
            Not in your list
          </ThemedText>
        </View>
      </View>
    );
  }
  const {started, ended, status, score, progress, totalEpisodes} = props.data;

  const IconText = (iconName: string, data: string) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          padding: 5,
          alignItems: 'center',
        }}>
        <Icon
          name={iconName}
          type={'MaterialIcons'}
          color={'white'}
          size={35}
        />
        <ThemedText
          style={{
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
            marginLeft: 4,
            flex: 1,
            textAlign: 'center',
          }}>
          {data}
        </ThemedText>
      </View>
    );
  };

  const removeInvalids = (day: string): string => {
    if (day === 'Invalid Date') return '-';
    else return day;
  };

  const dater = (
    pick: 'day' | 'month' | 'year',
    chrono: 'started' | 'ended',
  ): string => {
    let picker = chrono === 'started' ? started : ended;

    const date = new Date(picker);
    if (pick === 'day') return date.toLocaleDateString([], {day: 'numeric'});
    if (pick === 'month') return date.toLocaleDateString([], {month: 'long'});
    if (pick === 'year') return date.toLocaleDateString([], {year: 'numeric'});
    return '';
  };

  const _renderFirstBlock = (): JSX.Element => {
    return (
      <View style={styles.tiles.shadowView}>
        <View
          style={[
            styles.tiles.view,
            {backgroundColor: MapTrackingServiceToColors.get(tracker)},
          ]}>
          {IconText('remove-red-eye', status)}
          {IconText('subscriptions', (progress || '-') + ' / ' + totalEpisodes)}
          {IconText('star', (!score || score === 0 ? '-' : score).toString())}
        </View>
      </View>
    );
  };

  const _renderSecondBlock = (): JSX.Element => {
    return (
      <View style={styles.tiles.shadowView}>
        <View
          style={[
            styles.tiles.view,
            {
              backgroundColor: MapTrackingServiceToColors.get(tracker),
              alignItems: 'center',
              justifyContent: 'space-around',
            },
          ]}>
          <ThemedText style={{fontSize: 21, fontWeight: '400', color: 'white'}}>
            Started
          </ThemedText>
          <ThemedText style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
            {removeInvalids(dater('month', 'started'))}
          </ThemedText>
          <ThemedText style={{fontSize: 30, fontWeight: '700', color: 'white'}}>
            {removeInvalids(dater('day', 'started'))}
          </ThemedText>
          <ThemedText style={{fontSize: 23, fontWeight: '600', color: 'white'}}>
            {removeInvalids(dater('year', 'started'))}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.tiles.rowView}>
        <Image
          source={MapTrackingServiceToAssets.get(tracker)!}
          style={styles.tiles.assetImage}
        />
        <ThemedText style={styles.tiles.rowTitle}>{tracker}</ThemedText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{paddingVertical: height * 0.02}}>
        {_renderFirstBlock()}
        {_renderSecondBlock()}
      </ScrollView>
    </View>
  );
};
export const StatusTiles = memo(_StatusTiles);

const _WatchTile: FC<{
  episode: SimklEpisodes;
  detail: DetailedDatabaseModel;
  onPress: () => void;
  onFollow: (arg0: boolean) => void;
  isFollowing: boolean;
  onPlay: () => void;
}> = (props) => {
  const theme = useTheme((_) => _.theme);
  const queue = useQueueStore((_) => _.myQueue);
  const queueLength = useQueueStore((_) => _.queueLength);

  const inQueue = (): boolean => {
    if (queue[detail.title]) {
      const match = queue[detail.title].find(
        (i) => i.episode.episode === props.episode.episode,
      );
      if (match) return true;
    }
    return false;
  };

  useEffect(() => {
    if (detail) inQueue();
  }, [queueLength, queue]);

  if (!props.episode)
    return (
      <View
        style={{
          height: height * 0.2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            color: 'grey',
          }}>
          Finding your next episode
        </ThemedText>
      </View>
    );

  const {title, episode, img, description} = props.episode;
  const {onPress, onFollow, isFollowing, detail, onPlay} = props;

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ThemedText style={[styles.card.subTitle, {marginLeft: width * 0.04}]}>
          Watch Next
        </ThemedText>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <FlavoredButtons name={'play'} onPress={onPlay} />
          <FlavoredButtons
            name={isFollowing ? 'bell' : 'bell-outline'}
            onPress={() => {
              onFollow(!isFollowing);
            }}
          />
          <FlavoredButtons name={'cog'} onPress={() => {}} />
        </View>
      </View>
      <View style={styles.tiles.shadowView}>
        <View
          style={[
            styles.watchTile.view,
            {backgroundColor: theme.colors.backgroundColor},
          ]}>
          <View style={styles.watchTile.image}>
            {img ? (
              <DangoImage url={img} style={styles.watchTile.thumbnail} />
            ) : (
              <Image
                source={require('../../assets/images/icon_round.png')}
                style={styles.watchTile.thumbnail}
              />
            )}
          </View>
          <View style={styles.watchTile.textView}>
            <ThemedText
              style={styles.watchTile.title}
              numberOfLines={2}
              shouldShrink>
              {title}
            </ThemedText>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ThemedText style={{color: theme.colors.accent}}>
                Episode {episode}
              </ThemedText>
              {inQueue() ? (
                <ThemedText style={{fontWeight: '700', color: 'green'}}>
                  In Queue
                </ThemedText>
              ) : null}
            </View>
            <ScrollView style={{marginTop: 10}}>
              <ThemedText style={styles.watchTile.desc}>
                {description ??
                  'No description provided for this anime at this time'}
              </ThemedText>
            </ScrollView>
          </View>
        </View>
        <ThemedButton
          title={'View all episodes'}
          onPress={onPress}
          style={{alignSelf: 'center', marginBottom: 15}}
        />
      </View>
    </View>
  );
};
export const WatchTile = memo(_WatchTile);

export const FlavoredButtons: FC<{
  name: string;
  onPress: () => void;
  size?: number;
}> = (props) => {
  const {size, name, onPress} = props;
  const theme = useTheme((_) => _.theme);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.tiles.shadowView}>
        <View
          style={{
            height: size ?? height * 0.06,
            aspectRatio: 1 / 1,
            borderRadius: (size ?? height * 0.1) / 2,
            backgroundColor: theme.colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: width * 0.04,
          }}>
          <Icon
            name={name}
            type={'MaterialCommunityIcons'}
            size={30}
            color={'white'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BindTitleBlock: FC<{
  title: string;
  id: number;
}> = (props) => {
  const {title, id} = props;
  const navigation = useNavigation();

  return (
    <ThemedCard style={{marginVertical: width * 0.01, padding: 8}}>
      <View style={{padding: 12}}>
        <ThemedText
          style={{fontWeight: '700', fontSize: 15, textAlign: 'center'}}>
          Bind an anime from a source to Taiyaki to start watching
        </ThemedText>
        <ThemedButton
          title={'Bind An Anime!'}
          onPress={() => navigation.navigate('BindPage', {title, id})}
          style={{alignSelf: 'center', marginVertical: height * 0.014}}
        />
      </View>
    </ThemedCard>
  );
};

const styles = {
  row: StyleSheet.create({
    container: {
      height: height * 0.41,
      width,
      marginVertical: height * 0.01,
    },
    titleView: {
      marginBottom: height * 0.025,
      paddingHorizontal: width * 0.02,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 21,
      fontWeight: 'bold',
    },
    subTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: 'grey',
    },
  }),
  card: StyleSheet.create({
    view: {
      height: height * 0.25,
      width: width * 0.36,
      marginHorizontal: width * 0.02,
    },
    image: {
      height: '94%',
      width: '100%',
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOpacity: 0.2,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 6,
          shadowColor: 'black',
        },
      }),
    },
    title: {
      fontSize: 14,
      marginTop: 8,
    },
    subTitle: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: height * 0.01,
      marginBottom: height * 0.01,
    },
  }),
  tiles: StyleSheet.create({
    shadowView: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOpacity: 0.2,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 6,
          shadowColor: 'black',
        },
      }),
    },
    view: {
      borderRadius: 6,
      height: height * 0.21,
      aspectRatio: 1 / 1,
      marginHorizontal: width * 0.02,
    },
    rowView: {
      flexDirection: 'row',
      width: '100%',
      padding: height * 0.01,
      alignItems: 'center',
    },
    emptyView: {
      flexDirection: 'row',
      width: '95%',
      padding: height * 0.01,
      alignItems: 'center',
    },
    rowTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginHorizontal: width * 0.02,
    },
    assetImage: {
      width: width * 0.1,
      aspectRatio: 1 / 1,
    },
  }),
  watchTile: StyleSheet.create({
    view: {
      flex: 1,
      width: '95%',
      borderRadius: 6,
      overflow: 'hidden',
      flexDirection: 'row',
      height: height * 0.2,
      alignSelf: 'center',
      marginTop: height * 0.01,
      marginBottom: height * 0.02,
    },
    image: {
      width: width * 0.35,
    },
    thumbnail: {
      height: '100%',
      width: '100%',
    },
    textView: {
      paddingHorizontal: width * 0.02,
      flexShrink: 0.9,
    },
    title: {
      fontWeight: '600',
      fontSize: 16,
    },
    desc: {
      color: 'grey',
      fontSize: 12,
    },
  }),
};
