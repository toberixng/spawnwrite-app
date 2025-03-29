import { Box, Flex, Heading, Text } from '@chakra-ui/react';

type SubdomainLayoutProps = {
  subdomain: string;
  children: React.ReactNode;
};

export default function SubdomainLayout({ subdomain, children }: SubdomainLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Flex as="header" p={4} bg="teal.500" color="white" justify="space-between">
        <Heading size="md">{subdomain}.spawnwrite.com</Heading>
        <Text>SpawnWrite</Text>
      </Flex>
      <Box as="main" p={6}>
        {children}
      </Box>
      <Box as="footer" p={4} bg="gray.100" textAlign="center">
        <Text>&copy; 2025 SpawnWrite</Text>
      </Box>
    </Box>
  );
}