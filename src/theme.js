import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#C32635',
    },
    secondary: {
      main: '#FDC011',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;