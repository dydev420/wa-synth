import './App.css';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import SynthUI from './components/SynthUI';

import themeDark from './themes/themeDark';
import themeLight from './themes/themeLight';



function App() {
  return (
    <>
      <ThemeProvider theme={themeDark}>
        <CssBaseline>
            <SynthUI />
        </CssBaseline>
      </ThemeProvider>
    </>
  )
}

export default App;

