'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  
  palette: {
    primary: {
      main: '#059669', 
      light: '#34d399', // Emerald 400
      dark: '#047857',  // Emerald 700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b', // Slate 500
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
    },
    error: {
      main: '#dc2626', // Red 600
    },
    grey: {
      200: '#e2e8f0', // Slate 200
      300: '#cbd5e1', // Slate 300
    },
  },

  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    // ... todo
  },
 
  
  shape: {
    borderRadius: 6,
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
          textTransform: 'none', // No more ALL CAPS buttons
          fontWeight: 600,       // ✅ Set font weight to semibold
          padding: '8px 12px',
        },
      },
    },

    // TextField and Input Overrides
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Style the border color on focus
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#059669', 
          },
        },
        notchedOutline: {
          borderColor: '#cbd5e1', 
        },

        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem',
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
});

