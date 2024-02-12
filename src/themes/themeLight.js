import { createTheme } from "@mui/material";

import pallet1 from '../colors/pallet1';

const themeLight = createTheme({
  palette: {
    mode: 'light',
    ...pallet1
  },
  typography: {
    fontSize: 12
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => `
        body {
          background: ${themeParam.palette.primary.light};
        }
      `,
    },
  },
});

export default themeLight;
