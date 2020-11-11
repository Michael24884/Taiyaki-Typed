import create from 'zustand';
import {BaseTheme, LightTheme} from '../Models/theme';

type ThemeType = {
  theme: BaseTheme;
  setTheme: (arg0: BaseTheme) => void;
};

export const useTheme = create<ThemeType>((_) => ({
  theme: LightTheme,
  setTheme: (_) => {},
}));
