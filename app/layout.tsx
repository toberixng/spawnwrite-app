// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const metadata = {
  title: 'SpawnWrite',
  description: 'A simple app for capturing moments',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}