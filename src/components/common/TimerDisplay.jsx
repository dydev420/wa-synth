import React, { useRef } from 'react';
import PropTypes  from 'prop-types';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import useAnimationFrame from '../../hooks/useAnimationFrame';
import { noop } from '../../utils/common';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const TIMER_DEFAULTS = {
  labels: {
    idle: 'Start',
    running: 'Stop',
  },
  colors: {
    idle: 'playGreen',
    running: 'stopRed'
  },
  icons: {
    idle: <PlayArrowIcon />,
    running: < StopCircleIcon />,
  },
}

function TimerDisplay({
  controls = false,
  isRunning = false,
  timeRef,
  startRunning = noop,
  stopRunning = noop,
  labelProps = { ...TIMER_DEFAULTS.labels },
  colorProps = { ...TIMER_DEFAULTS.colors },
  iconProps = { ...TIMER_DEFAULTS.icons },
}) {
  const timeDisplay = useRef();

  const handleButtonClick = () => {
    if(!controls) {
      return;
    }

    if(isRunning) {
      return stopRunning();
    }

    return startRunning();
  }

  useAnimationFrame(() => {
    if(timeRef?.current !== undefined) {
      updateTimerDisplay(timeRef.current);
    }
  });

  const covertTo2DigitString = (number) => {
    if (number < 10) {
      return `0${Math.round(number)}`;
    }
    if (number > 99) {
      return `${Math.round(number/10)}`
    }
    return number;
  }

  const updateTimerDisplay = (time) => {
    const playSeconds = covertTo2DigitString(Math.floor(time / 1000));
    const playMills = covertTo2DigitString(Math.floor(time) - (playSeconds * 1000));
    timeDisplay.current.textContent = `${playSeconds}: ${playMills}`;
  }

  return (
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: '700',
          color: isRunning ? colorProps.running: colorProps.idle,
        }}  
      >
        { controls && (
          <Tooltip
            disableInteractive
            title = {
              isRunning
                ? labelProps.running ?? TIMER_DEFAULTS.labels.running
                : labelProps.idle ?? TIMER_DEFAULTS.labels.idle
            }
          >
            <IconButton
              onClick={handleButtonClick}
              color= {
                isRunning
                  ? colorProps.running ?? TIMER_DEFAULTS.colors.running
                  : colorProps.idle ?? TIMER_DEFAULTS.colors.idle
              }
              aria-label = {
                isRunning
                  ? labelProps.running ?? TIMER_DEFAULTS.labels.running
                  : labelProps.idle ?? TIMER_DEFAULTS.labels.idle
              }
            >
              { isRunning
                  ? iconProps.running ?? TIMER_DEFAULTS.icons.running
                  : iconProps.idle ?? TIMER_DEFAULTS.icons.idle
              }
            </IconButton>
          </Tooltip>
        )}
        <Typography fontFamily="Tilt Neon" fontWeight={900} align='center' ref={timeDisplay} />
    </Box>
  )
}

TimerDisplay.propTypes = {
  controls: PropTypes.bool,
  isRunning: PropTypes.bool,
  timeRef: PropTypes.ref,
  startRunning: PropTypes.func,
  stopRunning: PropTypes.func,
  labelProps: PropTypes.shape({
    idle: PropTypes.string,
    running: PropTypes.string,
  }),
  colorProps: PropTypes.shape({
    idle: PropTypes.string,
    running: PropTypes.string,
  }),
  iconProps: PropTypes.shape({
    idle: PropTypes.node,
    running: PropTypes.node,
  }),
}

export default TimerDisplay;