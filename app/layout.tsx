// app/layout.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'SpawnWrite - Create, Publish, Monetize',
  description: 'A platform for content creators to write, publish, and grow their audience.',
};