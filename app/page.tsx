// app/page.tsx
import { Box, Button, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box p={8} textAlign="center">
      <Heading mb={4}>Welcome to SpawnWrite</Heading>
      <Text mb={4}>A platform for writers to create and share their stories.</Text>
      <Button>Get Started</Button>
    </Box>
  );
}