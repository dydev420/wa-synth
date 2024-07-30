import React from 'react';
import { Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import useKeyRecorder from '../../hooks/useKeyRecorder';
import TimerDisplay from '../common/TimerDisplay';

function KeyRecorderControls() {
  // Key Recorder
  const {
    isRecordingKeys,
    timeRef,
    saved,
    startRecording,
    stopRecording,
    resetRecording,
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
        action = {saved ? resetRecording : null }
        labelProps = {{
          idle: 'Record',
        }}
        colorProps = {{
          idle: 'accent',
        }}
        iconProps={{
          idle: <KeyboardVoiceIcon />,
          action: <DeleteOutlineIcon />,
        }}
      />
    </Box>
  )
}

export default KeyRecorderControls;
