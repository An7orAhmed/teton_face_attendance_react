import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#c62736',
    },
    secondary: {
      main: '#fb7f07',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;