// app/page.tsx
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box textAlign="center" py={20}>
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to SpawnWrite
      </Heading>
      <Text fontSize="xl" mb={6}>
        Create, publish, and monetize your content with ease.
      </Text>
      <Button as={Link} href="/auth/sign-up" colorScheme="blue" size="lg">
        Get Started
      </Button>
    </Box>
  );
}