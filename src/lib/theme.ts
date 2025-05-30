import { createTheme } from "@mui/material";

const typography = {
  fontFamily: "Montserrat, sans-serif",
  fontSize: 16,
  codeLike: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "'Space Grotesk',Merriweather Sans",
  },
  professional: {
    fontFamily: "'DM Mono',Merriweather Sans",
  },
  playful: {
    fontFamily: "'Sacramento', cursive",
  },
  caligrapghy: {
    fontFamily: "'Lavishly Yours', cursive",
  },
  handWritten: {
    fontFamily: "'Caveat', sacramento",
  },
};

// 🎨 MUI Palette Explanation:
// - `primary.main`: Main brand color used for buttons, links, and highlights.
// - `secondary.main`: Accent color used for secondary actions and highlights.
// - `background.default`: Main background color of the app (applied to <body>).
// - `background.paper`: Used for surfaces like cards, modals, and popups.
// - `text.primary`: Default text color used for headings and body content.
// - `text.secondary`: Lighter text color used for subtitles and less important text.

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#DAFDBA" },
    secondary: { main: "#012030" },
    background: { default: "#FFFFFF", paper: "rgb(218, 224, 231)" },
    text: { primary: "#000000", secondary: "#555555" },
    social: {
      github: { color: "white", backgroundColor: "green", iconColor: "green" },
      instagram: {
        color: "black",
        backgroundColor: "white",
        iconColor: "black",
      },
      linkedin: { color: "white", backgroundColor: "blue", iconColor: "blue" },
      mail: { color: "white", backgroundColor: "red", iconColor: "red" },
    },
  },
  typography,
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "rgb(8, 2, 30)" },
    secondary: { main: "rgb(131, 137, 82)" },
    background: { default: "#121212", paper: "rgba(65, 58, 58, 0.68)" },
    text: { primary: "#FFFFFF", secondary: "#BBBBBB" },
    social: {
      github: {
        backgroundColor: "black",
        color: "greenyellow",
        iconColor: "greenyellow",
      },
      instagram: {
        backgroundColor: "black",
        color: "white",
        iconColor: "white",
      },
      linkedin: {
        backgroundColor: "black",
        color: "deepskyblue",
        iconColor: "deepskyblue",
      },
      mail: { backgroundColor: "black", color: "red", iconColor: "red" },
    },
  },
  typography,
});

export type LightTheme = typeof lightTheme;
export type DarkTheme = typeof darkTheme;

export { darkTheme, lightTheme };

