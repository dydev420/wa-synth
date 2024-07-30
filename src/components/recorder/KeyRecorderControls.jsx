import React from 'react';
import { Box } from '@mui/material';
import useKeyRecorder from '../../hooks/useKeyRecorder';
import TimerDisplay from '../common/TimerDisplay';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

function KeyRecorderControls() {
  // Key Recorder
  const {
    isRecordingKeys,
    timeRef,
    startRecording,
    stopRecording,
  } = useKeyRecorder();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}  
    >
      <TimerDisplay
        controls
        isRunning={isRecordingKeys}
        timeRef={timeRef}
        startRunning = {startRecording}
        stopRunning = {stopRecording}
        labelProps = {{
          idle: 'Record',
        }}
        colorProps = {{
          idle: 'primary',
        }}
        iconProps={{
          idle: <KeyboardVoiceIcon />
        }}
      />
    </Box>
  )
}

export default KeyRecorderControls;
