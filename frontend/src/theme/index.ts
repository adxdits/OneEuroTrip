import { createTheme } from '@mui/material/styles'

// Airbnb-inspired color palette
export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF385C', // Airbnb red/pink
      light: '#FF5A7E',
      dark: '#E31C5F',
    },
    secondary: {
      main: '#00A699', // Airbnb teal
      light: '#26B5A8',
      dark: '#008489',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F7F7F7',
    },
    text: {
      primary: '#484848',
      secondary: '#767676',
    },
  },
  typography: {
    fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
})