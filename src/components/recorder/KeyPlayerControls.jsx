import React from 'react';
import { Box } from '@mui/material'
import useKeyPlayer from '../../hooks/useKeyPlayer'
import TimerDisplay from '../common/TimerDisplay';
import StopIcon from '@mui/icons-material/Stop';
import RepeatIcon from '@mui/icons-material/Repeat';

function KeyPlayerControls() {
  const {
    isPlayingKeys,
    looping,
    startLooping,
    stopLooping,
    timeRef,
    startPlaying,
    stopPlaying,
  } = useKeyPlayer();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}  
    >
      <TimerDisplay
        controls
        isRunning = {isPlayingKeys}
        timeRef = {timeRef}
        startRunning = {startPlaying}
        stopRunning = {stopPlaying}
        action = { looping ? stopLooping : startLooping}
        labelProps = {{
          idle: 'Play',
          running: 'Stop',
        }}
        colorProps={{
          idle: 'accent',
          action: looping ? 'green' : 'primary'
        }}
        iconProps={{
          running: <StopIcon />,
          action: <RepeatIcon />
        }}
      />
    </Box>
  )
}

export default KeyPlayerControls