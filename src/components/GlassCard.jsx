import { Box } from '@mui/material';
import Color from 'color';


function GlassCard(props) {
  const {
    color = '#ffffff',
    ...rest
  } = props;

  return (
    <Box
      sx={{
        backgroundColor: Color(color).alpha(0.2).toString(),
        backgroundImage: `linear-gradient(to bottom right, ${Color(color).alpha(0.2).toString()}, ${Color(color).alpha(0).toString()})`,
        backdropFilter: 'blur(7px)',
        boxShadow: '10px 10px 10px rgba(30, 30, 30, 0.1)',
        borderRadius: '16px',
        borderLeft: `solid 1px ${Color(color).alpha(0.3).toString()}`,
        borderTop: `solid 1px ${Color(color).alpha(0.8).toString()}`,
      }}
      {...rest}
    />
  )
}

export default GlassCard;
