import PropTypes  from 'prop-types';
import useSynthStore from '../stores/useSynthStore';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import SynthSlider from './SynthSlider';

const filterTypes = {
  LOWPASS: 'lowpass',
  HIGHPASS: 'highpass',
  BANDPASS: 'bandpass',
  LOWSELF: 'lowshelf',
  HIGHSELF: 'highshelf',
  PEAKING: 'peaking',
  NOTCH: 'notch',
  ALLPASS: 'allpass',
};

function Filter(props) {
  /**
   * Stores
   */
  const filter1Config = useSynthStore(state => state.filter1Config);
  const changeFilter1Config = useSynthStore(state => state.changeFilter1Config);
  const changeFilter1Type = useSynthStore(state => state.changeFilter1Type);

  /**
   * Event handler
   */
  const handleRangeSlider = (event) => {
    const { name, value } = event.target;

    changeFilter1Config(name, value);
  };

  const handleOptionSelect = (event) => {
    const { name, value } = event.target;

    if(name === 'type') {
      changeFilter1Type(value);
    }
  };

  return (
    <Box flex="1" height="100%">
      <Stack
        // alignItems="stretch"
        justifyContent="center"
        height="100%"
      >  
        <Stack
          className="synth-panel-sliders"
          justifyContent="space-around"
          direction="row"
          height="100%"
          py={1}
        > 
          <SynthSlider
            orientation="vertical"
            name="frequency"
            label="Freq"
            max={1000}
            value={filter1Config.frequency}
            onChange={handleRangeSlider}
          />

          <SynthSlider
            orientation="vertical"
            name="detune"
            label="Det"
            value={filter1Config.detune}
            onChange={handleRangeSlider}
          />

          <SynthSlider
            orientation="vertical"
            name="Q"
            label="Q"
            max={10}
            step={0.01}
            value={filter1Config.Q}
            onChange={handleRangeSlider}
          />

          <SynthSlider
            orientation="vertical"
            name="gain"
            label="Gain"
            max={10}
            step={0.01}
            value={filter1Config.gain}
            onChange={handleRangeSlider}
          />
        </ Stack>

        <Box p={2} className="synth-panel-selectors">
          <FormControl fullWidth size="small">
            <InputLabel id="filter-type-label">Filter Type</InputLabel>
            <Select
              id="filter-type"
              labelId="filter-type-label"
              name="type"
              variant="outlined"
              value={filter1Config.type}
              onChange={handleOptionSelect}
            >
              {
                Object.values(filterTypes).map((type) => {
                  return (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  )
}

Filter.propTypes = {
  onFieldChange: PropTypes.func,
  onTypeChange: PropTypes.func
};

export default Filter;
