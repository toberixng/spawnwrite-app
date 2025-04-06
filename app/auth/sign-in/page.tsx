"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useClerk } from '@clerk/nextjs';
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();

  if (!isLoaded) return <Text>Loading...</Text>;

  const handleEmailSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === 'complete') {
        router.push('/dashboard');
      } else {
        setError('Please verify your email first.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err.errors?.[0]?.message || 'Sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setResetSent(false);
    if (!email) {
      setError('Please enter your email to reset your password.');
      setIsLoading(false);
      return;
    }
    try {
      await signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });
      setResetSent(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Box
        flex={{ base: 'none', md: 1 }}
        h={{ base: '40vh', md: '100vh' }}
        bgImage="url('https://images.unsplash.com/photo-1503435824048-a799a3a84bf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')"
        bgSize="cover"
        bgPosition="center"
      />
      <Box flex={{ base: '1', md: 1 }} p={{ base: 4, md: 8 }} bg="gray.50">
        <VStack spacing={6} maxW="400px" mx="auto">
          <Heading size="lg" color="primary">Log in</Heading>
          <Text fontSize="sm" color="black">
            Don’t have an account?{' '}
            <Button variant="link" color="black" onClick={() => router.push('/auth/sign-up')}>
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
              _focus={{ borderColor: 'primary' }}
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
                _focus={{ borderColor: 'primary' }}
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
              bg="#121C27"
              color="#b8c103"
              _hover={{ bg: '#b8c103', color: '#121C27' }}
              onClick={handleEmailSignIn}
              isDisabled={isLoading}
              isLoading={isLoading}
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
              color="black"
              leftIcon={<Image src="https://www.google.com/favicon.ico" boxSize={4} />}
              onClick={handleGoogleSignIn}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Log in with Google
            </Button>
            <Button
              variant="link"
              color="black"
              onClick={handlePasswordReset}
              isDisabled={isLoading}
            >
              Forgot Password?
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}