'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#059669', 
      light: '#34d399', // Emerald 400
      dark: '#047857',  // Emerald 700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    error: {
      main: '#dc2626',
    },
    grey: {
      200: '#e2e8f0',
      300: '#cbd5e1',
    },
  },

  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontSize: 14,
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 700, fontSize: '1.5rem' },
  },

  shape: {
    borderRadius: 4,
  },

  components: {
    // Button Overrides
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,      
          padding: '8px 12px',
        },
      },
    },

    
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: "small"
      },
      
    },
    
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Style the border color on focus
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#06c689', 
          },
        },
        notchedOutline: {
          borderColor: '#cbd5e1', 
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          
          '&.Mui-focused': {
            color: '#059669', 
          },
        },
      },
    },

    MuiCard: {
        defaultProps: {
            variant: 'outlined',
        },
        styleOverrides: {
            root: {
                borderRadius: 12,
                borderColor: '#e2e8f0', // grey.200
            }
        }
    },
   
    // Link Overrides
    MuiLink: {
        defaultProps: {
            underline: 'hover',
        },
        styleOverrides: {
            root: {
                color: '#059669', 
                fontWeight: 500,
            }
        }
    },
  },
};

export const muiTheme = createTheme(themeOptions);

