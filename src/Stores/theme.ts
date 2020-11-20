import create from 'zustand';
import {BaseTheme, LightTheme, TaiyakiDarkTheme} from '../Models/theme';

type ThemeType = {
  theme: BaseTheme;
  setTheme: (arg0: BaseTheme) => void;
};

export const useTheme = create<ThemeType>((_) => ({
  theme: TaiyakiDarkTheme,
  setTheme: (_) => {},
}));
