import React from 'react';
import { Box } from '@mui/material'
import useKeyPlayer from '../hooks/useKeyPlayer'
import TimerDisplay from './common/TimerDisplay';
import StopIcon from '@mui/icons-material/Stop';
function KeyPlayerControls() {
  const {
    isPlayingKeys,
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
        labelProps = {{
          idle: 'Play',
          running: 'Stop',
        }}
        colorProps={{
          idle: 'primary',
        }}
        iconProps={{
          running: <StopIcon />
        }}
      />
    </Box>
  )
}

export default KeyPlayerControls