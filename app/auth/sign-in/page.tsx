// app/auth/sign-in/page.tsx
"use client";

import { useState } from 'react';
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
  Image,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async () => {
    setError(null);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.session) {
      router.push('/dashboard');
    } else {
      setError('Please confirm your email before signing in.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('Google sign-in redirectTo:', redirectTo); // Debug log
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setResetSent(false);
    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  };

  // Rest of your UI code remains unchanged
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
        <HStack position="absolute" bottom={4} left="50%" transform="translateX(-50%)">
          <Box w={2} h={2} bg="gray.400" borderRadius="full" />
          <Box w={2} h={2} bg="gray.400" borderRadius="full" />
          <Box w={2} h={2} bg="white" borderRadius="full" />
        </HStack>
      </Box>
      <Box flex={{ base: '1', md: 1 }} p={{ base: 4, md: 8 }} bg="gray.50" color="text">
        <VStack spacing={6} maxW="400px" mx="auto">
          <Heading size="lg" color="secondary">Log in</Heading>
          <Text fontSize="sm">
            Don’t have an account?{' '}
            <Button variant="link" color="secondary" onClick={() => router.push('/auth/sign-up')}>
              Create an account
            </Button>
          </Text>
          <VStack spacing={4} w="full">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="white"
              color="gray.800"
              _placeholder={{ color: 'gray.500' }}
              borderColor="gray.300"
              _focus={{ borderColor: 'secondary' }}
            />
            <Box position="relative" w="full">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="white"
                color="gray.800"
                _placeholder={{ color: 'gray.500' }}
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
            <Button
              w="full"
              bg="primary"
              color="white"
              _hover={{ bg: 'primary', opacity: 0.9 }}
              onClick={handleEmailSignIn}
            >
              Log in
            </Button>
            {error && <Text color="red.500">{error}</Text>}
            {resetSent && (
              <Text color="green.500">Password reset email sent! Check your inbox.</Text>
            )}
            <Button
              w="full"
              variant="outline"
              borderColor="gray.300"
              bg="white"
              color="gray.800"
              leftIcon={<Image src="https://www.google.com/favicon.ico" boxSize={4} />}
              onClick={handleGoogleSignIn}
            >
              Log in with Google
            </Button>
            <Button variant="link" color="secondary" onClick={handlePasswordReset}>
              Forgot Password?
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}