import { Box, Container, Paper, Stack, makeStyles, useMediaQuery } from '@mui/material';
import SynthPanel from './SynthPanel';
import Oscillator from './Oscillator';
import Filter from './Filter';
import Envelope from './Envelope';
import Tweaks from './Tweaks';
import TweaksTabView from './TweaksTabView';
import PianoWindow from './PianoWindow';
import KeyRecorder from './recorder/KeyRecorder';

function SynthUI() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Container
      sx={{
        py: 2,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // backgroundColor: 'primary.dark'
      }}
    >
      <Paper
        sx={{
          width: '100%'
        }}
      >
        <Stack>
          <SynthPanel height="8rem">
            {
              !isMobile && <KeyRecorder />
            }
            <Oscillator />
          </SynthPanel>
          
          <SynthPanel height="16rem">
            <Tweaks />
            {/* <TweaksTabView /> */}
          </SynthPanel>
          
          <SynthPanel height="10rem" noPadding>
            <PianoWindow />
          </SynthPanel>
        </Stack>
      </Paper>
    </Container>
  )
}

export default SynthUI;
