/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';
import {useTheme} from '../../Stores/theme';

interface TextProps {
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export const ThemedText: FC<TextProps> = (props) => {
  const {style, numberOfLines, children} = props;
  const color = useTheme((_) => _.theme.colors.text);
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{color}, style, {fontFamily: 'Poppins'}]}>
      {children}
    </Text>
  );
};

interface ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const ThemedSurface: FC<ViewProps> = (props) => {
  const {style, children} = props;
  const backgroundColor = useTheme((_) => _.theme.colors.surface);
  return <View style={[style, {backgroundColor}]}>{children}</View>;
};
