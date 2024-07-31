import { InputLabel, Slider, Stack, Typography } from '@mui/material';
import React from 'react'

function SynthSlider({
  name,
  max,
  value,
  orientation,
  label,
  onChange,
  ...restProps
}) {

  const isVertical = orientation === "vertical";

  let orientProps = {
    orientation: 'horizontal'
  }

  if(isVertical) {
    orientProps = {
      orientation: 'vertical',
    }
  }

  return (
    <Stack
      alignItems="center"
      flex="1"
    >
      {
        label &&
          <Typography
            variant="subtitle2"
            width="100%"
            textAlign="center"
            textOverflow="ellipsis"
            mb={isVertical ? 1 : -1}
          >
            {label}
          </Typography>
      }
      <Slider
        // size="small"
        name={name}
        value={value}
        max={max}
        onChange={onChange}
        orientation={isVertical ? 'vertical' : 'horizontal'}
        sx={[
          {
            '& .MuiSlider-thumb': {
              borderRadius: '2px',
            },
          },

          isVertical && {
            minHeight: '4rem',
            '& .MuiSlider-thumb': {
              height: '6px'
            },
          },

          !isVertical && {
            '& .MuiSlider-thumb': {
              width: '6px'
            },
          }
        ]}
        { ...restProps}
      />
      
    </Stack>
  )
}

export default SynthSlider;
