import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      500: '#04171a', // Dark teal for headers, buttons, etc.
    },
    accent: {
      500: '#f9be17', // Yellow for highlights, buttons, etc.
    },
    gray: {
      50: '#f7fafc', // Light background
      100: '#edf2f7', // Footer background
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: 'primary.500',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'accent.500',
          color: 'primary.500',
          _hover: {
            bg: 'accent.600',
          },
        },
      },
    },
  },
});

export default theme;