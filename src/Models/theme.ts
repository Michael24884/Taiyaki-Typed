import {DefaultTheme, DarkTheme} from '@react-navigation/native';

export type BaseTheme = {
  dark: boolean;
  colors: {
    primary: string;
    backgroundColor: string;
    surface: string;
    text: 'white' | 'black';
    accent: string;
    card: string;
  };
};

export const LightTheme: BaseTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: 'purple',
    accent: 'pink',
    backgroundColor: 'white',
    surface: '#f0f0f0',
    text: 'black',
  },
};
export const TaiyakiDarkTheme: BaseTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: 'white',
    accent: 'cyan',
    backgroundColor: '#242a38',
    card: '#202532',
    surface: '#f0f0f0',
    text: 'white',
  },
};
