import {useNavigation} from '@react-navigation/native';
import React, {FC, memo} from 'react';
import {Button, Dimensions, Platform, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  AnilistPagedData,
  AnilistRequestTypes,
  Media,
} from '../../Models/Anilist';
import {useTheme} from '../../Stores/theme';
import {ThemedText} from './base';
import DangoImage from './image';

const {height, width} = Dimensions.get('window');

interface BaseCardProps {
  image: string;
  title: string;
  id: number;
}

const _BaseCards: FC<BaseCardProps> = (props) => {
  const {image, title} = props;
  return (
    <View style={styles.card.view}>
      <DangoImage url={image} style={styles.card.image} />
      <ThemedText numberOfLines={3} style={styles.card.title}>
        {title}
      </ThemedText>
    </View>
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
  const navigation = useNavigation();
  const theme = useTheme((_) => _.theme.colors);
  const ITEM_HEIGHT = height * 0.25;
  const {title, subtitle, data, type, path} = props;
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
        <Button title={'See All'} onPress={() => null} color={theme.accent} />
      </View>
      <FlatList
        data={data.data.Page.media}
        renderItem={renderItem}
        horizontal
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
      fontWeight: '300',
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
  }),
};
