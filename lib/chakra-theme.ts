// lib/chakra-theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#121C27", // Deep blue-gray for backgrounds
      secondary: "#b8c103", // Vibrant lime green for accents
      text: "#4B535D", // Muted gray for text
      secondaryHover: "#8F9900", // Darker shade of secondary for hover states
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.primary", // Background color
        color: "brand.text", // Default text color
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "brand.secondary", // Button background
          color: "brand.primary", // Button text
          _hover: {
            bg: "brand.secondaryHover", // Hover state
          },
        },
      },
    },
    Text: {
      baseStyle: {
        color: "brand.text", // Default text color
      },
    },
  },
});

export default theme;