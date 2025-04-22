import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Logo from '../assets/Logo.png'; 

function Header({ title }) {
  return (
    <Box sx={{ textAlign: 'left' }} className='flex gap-3 justify-between items-center' > 
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'primary.main' }}>
        {title}
      </Typography>
      <img src={Logo} className='w-44' />
    </Box>
  );
}

export default Header;