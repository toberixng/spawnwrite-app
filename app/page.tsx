// app/page.tsx
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h1" mb={4}>
        Welcome to SpawnWrite
      </Heading>
      <Text mb={6}>
        A platform for writers to create, publish, and share their stories.
      </Text>
      <Button>
        Get Started
      </Button>
    </Box>
  );
}