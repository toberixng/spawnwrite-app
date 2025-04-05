// app/page.tsx
import { Box, Heading, Button, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mb={6} color="secondary">
        Welcome to SpawnWrite
      </Heading>
      <Text fontSize="xl" mb={6} color="text">
        Create, share, and monetize your content with ease.
      </Text>
      <Button as={Link} href="/auth/sign-up" size="lg" variant="solid">
        Get Started
      </Button>
    </Box>
  );
}