import { createTheme } from "@mui/material";

import pallet1 from '../colors/pallet1';

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    ...pallet1
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

export default themeDark;
