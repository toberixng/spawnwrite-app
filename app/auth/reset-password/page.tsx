// app/auth/reset-password/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase-client';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is in reset mode
      }
    });
  }, []);

  const handleResetPassword = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const { error } = await supabaseClient.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/auth/sign-in'), 2000);
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Box
        flex={{ base: 'none', md: 1 }}
        h={{ base: '40vh', md: 'auto' }}
        bgImage="url('https://images.unsplash.com/photo-1503435824048-a799a3a84bf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')"
        bgSize="cover"
        bgPosition="center"
        p={{ base: 4, md: 8 }}
        color="white"
        position="relative"
      >
        <Flex justify="space-between" align="center" mb={8}>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">AMU</Text>
          <Button
            variant="outline"
            colorScheme="whiteAlpha"
            size={{ base: 'sm', md: 'md' }}
            onClick={() => router.push('/')}
          >
            Back to website
          </Button>
        </Flex>
        <Text
          position="absolute"
          bottom={{ base: 4, md: 8 }}
          left={{ base: 4, md: 8 }}
          fontSize={{ base: 'md', md: 'lg' }}
        >
          "Capturing Moments, Creating Memories"
        </Text>
        <VStack position="absolute" bottom={4} left="50%" transform="translateX(-50%)">
          <Box w={2} h={2} bg="gray.400" borderRadius="full" />
          <Box w={2} h={2} bg="gray.400" borderRadius="full" />
          <Box w={2} h={2} bg="white" borderRadius="full" />
        </VStack>
      </Box>
      <Box flex={{ base: '1', md: 1 }} p={{ base: 4, md: 8 }} bg="gray.50" color="text">
        <VStack spacing={6} maxW="400px" mx="auto">
          <Heading size="lg" color="secondary">Reset Password</Heading>
          <Text>Enter your new password below.</Text>
          <VStack spacing={4} w="full">
            <Box position="relative" w="full">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="white"
                color="gray.800"
                borderColor="gray.300"
                _focus={{ borderColor: 'secondary' }}
              />
              <IconButton
                aria-label="Toggle password visibility"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                variant="ghost"
              />
            </Box>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              bg="white"
              color="gray.800"
              borderColor="gray.300"
              _focus={{ borderColor: 'secondary' }}
            />
            <Button
              w="full"
              bg="primary"
              color="white"
              _hover={{ bg: 'primary', opacity: 0.9 }}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
            {error && <Text color="red.500">{error}</Text>}
            {success && (
              <Text color="green.500">Password reset successful! Redirecting to sign-in...</Text>
            )}
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}