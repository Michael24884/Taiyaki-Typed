import React, {FC} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {AnilistCharacterPageEdgeModel} from '../../Models/Anilist';
import {ThemedText} from './base';
import DangoImage from './image';

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

const styles = {
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
