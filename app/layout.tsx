// app/layout.tsx
"use client"; // Add this at the top

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import theme from '../lib/theme';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}