// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { ChakraProvider } from '@chakra-ui/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SpawnWrite',
  description: 'A platform to write, publish, and share your stories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ChakraProvider>{children}</ChakraProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}