import { useState } from 'react';
import PropTypes  from 'prop-types';
import useSynthStore from '../stores/useSynthStore';
import { Box, Stack } from '@mui/material';
import SynthSlider from './SynthSlider';


function Envelope(props) {
  /**
   * Stores
   */
  const envelopeConfig = useSynthStore(state => state.envelopeConfig);
  const changeEnvelopeConfig = useSynthStore(state => state.changeEnvelopeConfig);

  /**
   * Event handler
   */
  const handleRangeSlider = (event) => {
    const { name, value } = event.target;

    changeEnvelopeConfig(name, value);

    console.log(name, value);
  };


  return (
    <Box flex="1" height="100%">
      <Stack
        className="synth-panel-sliders"
        justifyContent="space-around"
        direction="row"
        height="100%"
        py={1}
      >    
        <SynthSlider
          orientation="vertical"
          name="attack"
          label="A"
          max={2}
          step={0.02}
          value={envelopeConfig.attack}
          onChange={handleRangeSlider}
        />

        <SynthSlider
          orientation="vertical"
          name="decay"
          label="D"
          max={1}
          step={0.01}
          value={envelopeConfig.decay}
          onChange={handleRangeSlider}
        />

        <SynthSlider
          orientation="vertical"
          name="sustain"
          label="S"
          max={1}
          step={0.01}
          value={envelopeConfig.sustain}
          onChange={handleRangeSlider}
        />

        <SynthSlider
          orientation="vertical"
          name="release"
          label="R"
          max={2}
          step={0.02}
          value={envelopeConfig.release}
          onChange={handleRangeSlider}
        />
      </ Stack>
    </Box>
  )
}

Envelope.propTypes = {
  onFieldChange: PropTypes.func,
  onTypeChange: PropTypes.func
};

export default Envelope;
