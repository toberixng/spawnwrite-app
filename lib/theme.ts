// lib/theme.ts
import { extendTheme } from '@chakra-ui/react'; // Changed from @chakra-ui/system

// Define your brand colors
const colors = {
  primary: '#121C27',
  secondary: '#b8c103',
  text: '#4B535D',
};

// Theme config for v2
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Extend the theme
const theme = extendTheme({
  config,
  colors: {
    ...colors,
    brand: {
      500: colors.primary,
      400: colors.secondary,
    },
  },
  styles: {
    global: {
      body: {
        bg: 'primary',
        color: 'text',
      },
      a: {
        color: 'secondary',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'secondary',
          color: 'primary',
          _hover: {
            bg: '#a0a900',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'secondary',
      },
    },
  },
});

export default theme;