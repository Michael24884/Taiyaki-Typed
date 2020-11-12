import React, {FC} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {ThemedSurface} from '.';
import DangoImage from './image';

const {height, width} = Dimensions.get('window');

interface ListRowProps {
  image: string;
  title: string;
}

export const ListRow: FC<ListRowProps> = (props) => {
  const {image, title} = props;
  return (
    <View style={styles.listRow.shadowView}>
      <ThemedSurface style={styles.listRow.view}>
        <DangoImage url={image} style={styles.listRow.image} />
      </ThemedSurface>
    </View>
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
  }),
};
