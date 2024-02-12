import { createTheme } from "@mui/material";

const themeBase = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b400ca' 
    },
    secondary: {
      main: '#f40085' 
    },
  },
  typography: {
    fontSize: 12
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => `
        body {
          background: ${themeParam.palette.primary.dark};
        }
      `,
    },
  },
});

export default themeBase;