import { Box, Container, Paper, Stack, makeStyles, useMediaQuery } from '@mui/material';
import SynthPanel from './SynthPanel';
import Oscillator from './Oscillator';
import Filter from './Filter';
import Envelope from './Envelope';
import Tweaks from './Tweaks';
import TweaksTabView from './TweaksTabView';
import PianoWindow from './PianoWindow';
import KeyRecorder from './recorder/KeyRecorder';
import Tempo from './tempo/Tempo';
import WaveAnalyzer from './visual/WaveAnalyzer';

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
          {
            isMobile &&
              <SynthPanel height="10rem">
                <WaveAnalyzer fullWidth height="8rem" />
              </SynthPanel>
          }
          <SynthPanel height={ isMobile ? "4rem" : "8rem" }>
            {
              !isMobile && (
                <>
                  <KeyRecorder />
                  <Tempo />
                </>
              ) 
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
