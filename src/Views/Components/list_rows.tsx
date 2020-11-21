/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemedSurface} from '.';
import {MyQueueModel} from '../../Models/taiyaki';
import {useTheme} from '../../Stores';
import {ThemedText} from './base';
import DangoImage from './image';

const {height, width} = Dimensions.get('window');

interface ListRowProps {
  image?: string;
  title: string;
  onPress?: () => void;
}

export const ListRow: FC<ListRowProps> = (props) => {
  const {image, title, onPress} = props;
  const theme = useTheme((_) => _.theme);
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <View
        style={[styles.listRow.shadowView, {marginHorizontal: width * 0.0055}]}>
        <ThemedSurface
          style={[styles.listRow.view, {backgroundColor: theme.colors.card}]}>
          {image ? (
            <DangoImage url={image} style={styles.listRow.image} />
          ) : (
            <Image
              source={require('../../assets/images/icon_round.png')}
              style={styles.listRow.image}
            />
          )}
          <View style={styles.listRow.textView}>
            <ThemedText style={styles.listRow.title}>{title}</ThemedText>
          </View>
        </ThemedSurface>
      </View>
    </TouchableOpacity>
  );
};

export const EpisodeSliders: FC<{
  onPress: () => void;
  item: MyQueueModel;
}> = (props) => {
  const {onPress, item} = props;
  const theme = useTheme((_) => _.theme);
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedSurface
        style={{
          flexDirection: 'row',
          paddingRight: 8,
          marginVertical: 6,
          height: height * 0.12,
          marginHorizontal: 8,
          flex: 1,
          ...Platform.select({android: {elevation: 3}}),
          backgroundColor: theme.colors.card,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexShrink: 0.8,
          }}>
          <Image
            source={
              item.episode.img !== null
                ? {uri: item.episode.img}
                : require('../../assets/images/icon_round.png')
            }
            style={[queueStyle.queueItemImage, {height: '100%', width: '45%'}]}
          />

          <View
            style={{
              flexDirection: 'column',
              flexShrink: 1,
              width: '55%',
              paddingVertical: 6,
            }}>
            <ThemedText
              style={[
                queueStyle.queueItemNumber,
                {color: theme.colors.primary},
              ]}>
              Episode {item.episode.episode}
            </ThemedText>
            <ThemedText style={queueStyle.queueItemTitle}>
              {item.episode.title ?? '???'}
            </ThemedText>
          </View>
        </View>
      </ThemedSurface>
    </TouchableOpacity>
  );
};

const styles = {
  listRow: StyleSheet.create({
    shadowView: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
      }),
    },
    view: {
      borderRadius: 6,
      overflow: 'hidden',
      flexDirection: 'row',
      height: height * 0.15,
      margin: width * 0.02,
    },
    image: {
      height: '100%',
      width: '28%',
    },
    textView: {
      paddingTop: height * 0.005,
      paddingHorizontal: width * 0.01,
      flexShrink: 0.9,
    },
    title: {
      fontSize: 15,
      fontWeight: '500',
    },
  }),
};

const queueStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: 'gray',
    fontSize: 14,
  },
  upNextView: {
    marginHorizontal: 10,
  },
  upNextImage: {
    borderRadius: 6,
    marginBottom: 5,
  },
  upNextEpisode: {
    fontSize: 13,
  },
  upNextTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  upNextDesc: {
    fontWeight: '400',
    color: 'gray',
    fontSize: 15,
  },
  emptyMessage: {
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  queueItemImage: {
    marginRight: 5,
  },
  queueItemTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  queueItemNumber: {
    fontSize: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 15,
  },

  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});
