import { Box } from '@mui/material';

function SynthPanel({
  children,
  noPadding,
  ...restProps
}) {
  return (
    <Box
      sx={{
        py: noPadding ? 0 : 2,
        // height: '16rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // flex: '1 1 100%',
        // overflow: 'hidden',
        border: 1
      }}
      {...restProps}
    >
      {children}
    </Box>
  )
}

export default SynthPanel;
