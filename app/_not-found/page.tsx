// app/_not-found/page.tsx
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box textAlign="center" py={10}>
      <Heading as="h1" size="2xl" mb={4}>
        404 - Page Not Found
      </Heading>
      <Text fontSize="lg" mb={6}>
        Sorry, the page you’re looking for doesn’t exist.
      </Text>
      <Button as={Link} href="/" colorScheme="yellow">
        Go to Homepage
      </Button>
    </Box>
  );
}