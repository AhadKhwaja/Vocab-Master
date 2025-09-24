import "styled-components";
export const theme = {
  light: {
    headerBackground: "#E0E5EC",
    headerBorder: "#A3B1C6",
    headerText: "#8A8A8A",
    bodyBackground: "#F0F0F0",
    cardBackground: "#E0E5EC",
    shadowLight: "#FFFFFF",
    shadowDark: "#A3B1C6",
    accent: "#B95E82",
  },
  dark: {
    headerBackground: "#2B2D30",
    headerBorder: "#1C1E21",
    headerText: "#C8C8C8",
    bodyBackground: "#222222",
    cardBackground: "#2B2D30",
    shadowLight: "#3A3C41",
    shadowDark: "#1C1E21",
    accent: "#F39F9F",
  },
};

type ThemeType = typeof theme.light;

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
