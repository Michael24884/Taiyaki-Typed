import {useNavigation} from '@react-navigation/native';
import React, {FC, useState} from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  AnilistCharacterPageEdgeModel,
  AnilistRecommendationPageEdgeModel,
  AnilistRecommendationPageModel,
} from '../../Models/Anilist';
import {useTheme} from '../../Stores';
import {TaiyakiParsedText, ThemedCard, ThemedText} from './base';
import DangoImage from './image';
import {FlavoredButtons} from './rows';

const {height, width} = Dimensions.get('window');

export const CharacterCard: FC<{character: AnilistCharacterPageEdgeModel}> = (
  props,
) => {
  const {
    character: {role, node},
  } = props;

  return (
    <View style={styles.cards.view}>
      <View style={styles.cards.shadow}>
        <DangoImage url={node.image.large} style={styles.cards.image} />
      </View>
      <ThemedText style={styles.cards.role}>{role}</ThemedText>
      <ThemedText numberOfLines={2} style={styles.cards.name}>
        {node.name.full}
      </ThemedText>
    </View>
  );
};

export const EpisodeTiles = () => {
  return <ThemedCard style={styles.tiles.view}></ThemedCard>;
};

export const RecCards: FC<{items: AnilistRecommendationPageEdgeModel}> = (
  props,
) => {
  const theme = useTheme((_) => _.theme);
  const {
    coverImage,
    title,
    id,
    bannerImage,
    description,
  } = props.items.node.mediaRecommendation;

  const [expanded, setExpanded] = useState<boolean>(false);
  const navigation = useNavigation();

  return (
    <ThemedCard style={{height: expanded ? undefined : height * 0.46}}>
      <>
        {bannerImage ? (
          <DangoImage url={bannerImage} style={styles.rec.banner} />
        ) : (
          <Image
            source={require('../../assets/images/icon_round.png')}
            style={styles.rec.banner}
          />
        )}
        <View
          style={[styles.rec.absolute, {backgroundColor: 'rgba(0,0,0, 0.25)'}]}
        />
      </>
      <View style={styles.rec.textView}>
        <View style={[styles.rec.imageView, styles.rec.shadow]}>
          <DangoImage url={coverImage.extraLarge} style={styles.rec.image} />
        </View>
        <View style={{padding: 6, flexShrink: 0.8}}>
          <ThemedText style={styles.rec.title} shouldShrink numberOfLines={3}>
            {title.romaji}
          </ThemedText>
        </View>
      </View>
      <View style={{flex: 1, padding: 8}}>
        <TaiyakiParsedText
          color={theme.colors.text}
          style={{}}
          numberOfLines={expanded ? undefined : 4}>
          {description ?? 'No description for this anime at this time'}
        </TaiyakiParsedText>
        <View
          style={{
            alignItems: 'flex-end',
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            marginTop: 4,
          }}>
          <FlavoredButtons
            size={40}
            name={'page-next'}
            onPress={() => navigation.push('Detail', {id})}
          />
          <FlavoredButtons
            size={40}
            name={expanded ? 'arrow-up' : 'arrow-down'}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setExpanded((ex) => !ex);
            }}
          />
        </View>
      </View>
    </ThemedCard>
  );
};

const styles = {
  rec: StyleSheet.create({
    view: {},
    textView: {
      flexDirection: 'row',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
    },
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: height * 0.18,
    },
    shadow: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowColor: 'black',
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
      }),
    },
    banner: {
      width: '100%',
      height: height * 0.18,
      borderTopRightRadius: 6,
      borderTopLeftRadius: 6,
    },
    imageView: {
      marginTop: -height * 0.08,
      marginLeft: width * 0.02,
      height: height * 0.17,
      width: '30%',
    },
    image: {
      height: '100%',
      width: '100%',
    },
  }),
  tiles: StyleSheet.create({
    view: {
      width: width * 0.85,
      alignSelf: 'center',
    },
  }),
  cards: StyleSheet.create({
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    role: {
      color: 'grey',
      fontWeight: '300',
      fontSize: 12,
      marginTop: 4,
    },
    name: {
      fontSize: 15,
      fontWeight: '400',
    },
    view: {
      height: height * 0.27,
      flex: 1 / 3,
      marginHorizontal: width * 0.01,
      marginVertical: height * 0.01,
    },
    shadow: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowColor: 'black',
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
      }),
      height: '70%',
      width: '100%',
    },
    image: {
      height: '100%',
      width: '100%',
    },
  }),
};
