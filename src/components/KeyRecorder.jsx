import React from 'react'
import { Box } from '@mui/material';
import KeyRecorderControls from './KeyRecorderControls';
import KeyPlayerControls from './KeyPlayerControls';

function KeyRecorder() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        fontWeight: '700',
        borderWidth: '2px',
        borderColor: 'red',
        borderStyle: 'dashed'
      }}
    >
      <span>Key Recorder</span>
      <KeyRecorderControls />
      <KeyPlayerControls />
    </Box>
  )
}

export default KeyRecorder;