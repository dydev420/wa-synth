import { useState } from 'react';
import PropTypes  from 'prop-types';
import useSynthStore from '../stores/useSynthStore';
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, Slider, Stack } from '@mui/material';
import SynthSlider from './SynthSlider';

const waveTypes = {
  SINE: 'sine',
  SQUARE: 'square',
  TRIANGLE: 'triangle',
  SAWTOOTH: 'sawtooth',
};

function Oscillator(props) {
  /**
   * Stores
   */
  const osc1Config = useSynthStore(state => state.osc1Config);
  const changeOsc1Config = useSynthStore(state => state.changeOsc1Config);
  const changeOsc1Type = useSynthStore(state => state.changeOsc1Type);
  
  /**
   * Event handler
   */
  const handleRangeSlider = (event) => {
    const { name, value } = event.target;

    changeOsc1Config(name, value);
  };

  const handleOptionSelect = (event) => {
    const { name, value } = event.target;

    console.log(name, value);

    if(name === 'type') {
      changeOsc1Type(value);
    }
  };

  return (
    <Box className="synth-panel-sliders">
      <Stack>
        {/* <SynthSlider
          name="detune"
          label="Detune"
          step={0.01}
          value={osc1Config.detune}
          onChange={handleRangeSlider}
        /> */}

        <Box>
          <ButtonGroup fullWidth disableElevation variant="contained">
            {
              Object.values(waveTypes).map((type) => {
                return (
                  <Button
                    key={type}
                    color={type === osc1Config.type ? 'secondary': 'primary'}
                    // variant={type === osc1Config.type ? 'contained': 'outlined'}
                    value={type}
                    name="type"
                    onClick={handleOptionSelect}
                  >
                    {type.toUpperCase()}
                  </Button>
                )
              })
            }
          </ButtonGroup>
        </Box>
      </Stack>
    </ Box>
  )
}

Oscillator.propTypes = {
  onFieldChange: PropTypes.func,
  onTypeChange: PropTypes.func
};

export default Oscillator;
