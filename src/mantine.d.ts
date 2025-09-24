import "@mantine/core";

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: {
      "custom-retro": MantineColorsTuple;
    };
  }
}

export {};