import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

export function createTheme(primaryColor: string, isDark: boolean): MD3Theme {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: primaryColor,
    },
  };
}

export const lightTheme = createTheme('#6750A4', false);
export const darkTheme = createTheme('#D0BCFF', true);
