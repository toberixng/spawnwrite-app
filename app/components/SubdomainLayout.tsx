// app/components/SubdomainLayout.tsx
'use client';

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

interface SubdomainLayoutProps {
  subdomain: string;
  children: React.ReactNode;
}

export default function SubdomainLayout({ subdomain, children }: SubdomainLayoutProps) {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, gray.50, white)" // Subtle background gradient
      py={8} // Vertical padding
    >
      <Container maxW="container.lg"> {/* Constrain content width */}
        <VStack spacing={6} align="stretch">
          {/* Header Section */}
          <Box textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              color="gray.800"
              fontWeight="bold"
              textTransform="capitalize"
            >
              {subdomain}&apos;s Space
            </Heading>
            <Text fontSize="lg" color="gray.600" mt={2}>
              Create, share, and connect with your audience
            </Text>
          </Box>
          {/* Main Content */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            {children}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}