import React, { useRef } from 'react';
import { Box, IconButton, TextField, Typography, useMediaQuery } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import useBpm from '../../hooks/useBpm';
import SynthSlider from '../SynthSlider';

const MAX_VOLUME = 10;

function Metronome() {
  // screen-size media query
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const lightDisplayRef = useRef(null);
  const {
    tempoConfig,
    volume,
    setVolume,
    increaseBpm,
    decreaseBpm,
    setBpm,
    startBpm,
    stopBpm
  } = useBpm((_time, step) => {
    if (lightDisplayRef.current?.children) {
      [...lightDisplayRef.current.children].forEach((child) => {
        const elCount = child.getAttribute('data-beat');

        if (Number(elCount) === step) {
          child.style.backgroundColor = '#ff0055';
        } else {
          child.style.backgroundColor = '#ffffff';
        }
      })
    }
  }, );

  const handleBpmButtons = (op) => {
    if (op === 'add') {
      increaseBpm();
    }
    if (op === 'remove') {
      decreaseBpm();
    }
  }

  const changeVolume = (event) => {
    const amount = event.target.value / MAX_VOLUME;
    setVolume(amount);
  }

  const getDisplayVolume = (amount) => {
    return amount * MAX_VOLUME;
  }

  const getIconSize = (isSmallScreen) => {
    return isSmallScreen ? 'large' : 'medium';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: '700',
        }}  
      >
        <IconButton size={getIconSize(isMobile)} onClick={() => startBpm()}>
          <PlayArrowIcon fontSize={getIconSize(isMobile)} />
        </IconButton>
        <Box
          ref={lightDisplayRef}
          sx={{
            width:'3.2rem',
            height:'0.4rem',
            display: 'flex',
            justifyContent: 'space-between',
            '> span': {
              width: '0.5rem',
              backgroundColor: '#ffffff'
            }
          }}
        >
          <span data-beat="0"></span>
          <span data-beat="1"></span>
          <span data-beat="2"></span>
          <span data-beat="3"></span>
        </Box>
        <IconButton size={getIconSize(isMobile)} onClick={() => stopBpm()}>
          <StopIcon fontSize={getIconSize(isMobile)} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: '700',
        }}  
      >
        <IconButton size={getIconSize(isMobile)} onClick={() => handleBpmButtons('add')}>
          <AddIcon fontSize={getIconSize(isMobile)} />
        </IconButton>
        <TextField
          size="small"
          color="green"
          type="number"
          value={tempoConfig.bpm}
          onChange={(event) => setBpm(event.target.value)}
          InputProps={{
            inputProps: {
              style: {
                textAlign: 'center',
              }
            }
          }}
        />
        <IconButton size={getIconSize(isMobile)} onClick={() => handleBpmButtons('remove')}>
          <RemoveIcon fontSize={getIconSize(isMobile)} />
        </IconButton>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: '700',
        }}  
      >
        <IconButton size={getIconSize(isMobile)} disabled>
          <VolumeDownIcon fontSize={getIconSize(isMobile)} />
        </IconButton>
        <SynthSlider
          orientation="horizontal"
          name="gain"
          max={MAX_VOLUME}
          step={0.5}
          size="small"
          value={getDisplayVolume(volume)}
          onChange={changeVolume}
        />
        <IconButton size={getIconSize(isMobile)} disabled>
          <VolumeUpIcon fontSize={getIconSize(isMobile)} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Metronome;
