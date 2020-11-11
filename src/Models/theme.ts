export type BaseTheme = {
  isDark: boolean;
  colors: {
    primary: string;
    backgroundColor: string;
    surface: string;
    text: 'white' | 'black';
  };
};

export const LightTheme: BaseTheme = {
  isDark: false,
  colors: {
    primary: 'purple',
    backgroundColor: 'white',
    surface: '#f0f0f0',
    text: 'black',
  },
};
