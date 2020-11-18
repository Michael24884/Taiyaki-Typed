import React, {FC} from 'react';
import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemedSurface} from '.';
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
