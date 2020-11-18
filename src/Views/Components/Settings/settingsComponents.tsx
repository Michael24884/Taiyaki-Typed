import React, {FC} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useTheme} from '../../../Stores';
import {ThemedSurface, ThemedText} from '../base';

const {height, width} = Dimensions.get('window');

export const SettingsRow: FC<{onPress?: () => void; isLast?: boolean}> = (
  props,
) => {
  const {children, isLast, onPress} = props;
  const theme = useTheme((_) => _.theme);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: 'grey',
          height: 0.14,
          width,
        }}
      />
      <ThemedSurface style={styles.rows.view}>{children}</ThemedSurface>
      {isLast ? (
        <View
          style={{
            backgroundColor: 'grey',
            height: 0.14,
            width,
          }}
        />
      ) : null}
    </TouchableWithoutFeedback>
  );
};

export const TaiyakiSettingsHeader = () => {
  return (
    <View style={styles.image.image}>
      <Image
        source={require('../../../assets/images/icon_round.png')}
        style={{height: '100%', width: '100%', marginBottom: 10}}
        resizeMode={'contain'}
      />
      <ThemedText style={styles.image.title}>Taiyaki</ThemedText>
    </View>
  );
};

const styles = {
  rows: StyleSheet.create({
    view: {
      width,
      padding: height * 0.01,
    },
  }),
  image: StyleSheet.create({
    image: {
      height: height * 0.15,
      width,
      marginBottom: height * 0.1,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  }),
};
