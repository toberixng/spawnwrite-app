// app/page.tsx
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box p={4} textAlign="center">
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to SpawnWrite
      </Heading>
      <Text fontSize="lg" mb={6}>
        A platform to write, publish, and share your stories.
      </Text>
      <Button as={Link} href="/auth/sign-in" colorScheme="teal" mr={4}>
        Sign In
      </Button>
      <Button as={Link} href="/auth/sign-up" colorScheme="teal" variant="outline">
        Sign Up
      </Button>
    </Box>
  );
}