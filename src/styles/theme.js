import { createMuiTheme } from '@material-ui/core/styles';

const background = {
  paper: `#eee`,
  default: `#fafafa`,
};

const baseFont = `Roboto, 'Helvetica Neue', Arial, sans-serif`;
const fonts = {
  headline: baseFont,
  body: `Dosis, ${baseFont}`,
};

const colors = {
  red: {
    main: `#cd1717`,
    light: `#e93d3d`,
    dark: `#a20707`,
    contrastText: `#fff`,
  },
  green: {
    main: `#5cb35c`,
    light: `#8fd28f`,
    dark: `#349234`,
    contrastText: `#fff`,
  },
  blue: {
    main: `#36a1f4`,
    light: `#8bc9f8`,
    dark: `#047cd8`,
    contrastText: `#fff`,
  },
  gold: {
    main: `#fcb448`,
    light: `#ffc46B`,
    dark: `#ed991c`,
    contrastText: `#fff`,
  },
  gray: {
    main: `#ccc`,
    light: `#eee`,
    dark: `#aaa`,
    contrastText: `#000`,
  },
};

export default createMuiTheme({
  palette: {
    primary: colors.blue,
    secondary: colors.green,
    error: colors.red,
    score: {
      low: colors.green.light,
      medium: colors.gold.main,
      high: colors.red.dark,
    },
    list: {
      header: colors.gray.light,
      headerBorder: colors.gray.dark,
    },
    background,
    ...colors,
  },
  typography: {
    fontFamily: baseFont,
    htmlFontSize: 16,
    headline: fonts.headline,
    body: fonts.body,
  },
});
