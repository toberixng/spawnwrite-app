// app/auth/sign-up/page.tsx
'use client';

import { SignUp } from '@clerk/nextjs';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export default function SignUpPage() {
  return (
    <Flex minH="100vh" bg="#F5F7FA">
      {/* Left Side - Form */}
      <Box flex="1" p={10} display="flex" alignItems="center" justifyContent="center">
        <Box maxW="md" w="full">
          <Heading mb={6} fontSize="2xl" color="#333">
            Create an account
          </Heading>
          <SignUp
            signInUrl="/auth/sign-in"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#1A3C34',
                  '&:hover': { backgroundColor: '#2A5C54' },
                },
                socialButtonsBlockButton: {
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  color: '#333',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Right Side - Green Section */}
      <Box flex="1" bg="#1A3C34" p={10} display="flex" alignItems="center" justifyContent="center">
        <Box color="white">
          <Heading fontSize="2xl" mb={4}>
            Create and Share with Ease
          </Heading>
          <Text fontSize="md" mb={6}>
            Welcome to SpawnWrite—a platform to write, publish, and grow your audience effortlessly
          </Text>
          <Box bg="white" p={4} borderRadius="md" mb={4}>
            <Text color="#333">Analytics Placeholder</Text>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}