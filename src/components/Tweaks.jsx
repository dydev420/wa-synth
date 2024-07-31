import { Box, Stack, useMediaQuery } from '@mui/material';
import Filter from './Filter';
import Envelope from './Envelope';
import TweaksTabView from './TweaksTabView';
import WaveAnalyzer from './visual/WaveAnalyzer';

function Tweaks() { 

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  if(isMobile) {
    return (
      <TweaksTabView />
    );
  }

  return (
    <Stack
      direction="row"
      width="100%"
      height="100%"
      justifyContent="space-around"
      alignItems="center"
    >
      <Filter />
      {
        !isMobile && <WaveAnalyzer />
      }
      <Envelope />
    </Stack>
  )
}

export default Tweaks;