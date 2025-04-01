// app/auth/sign-up/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { AuthError } from '@supabase/supabase-js';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/auth/sign-in`, // Changed from redirectTo
        },
      });

      if (error) throw error;

      toast({
        title: 'Account created!',
        description: 'Check your email to confirm your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/auth/sign-in');
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Error',
        description: authError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Error',
        description: authError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="md">
      <VStack spacing={4}>
        <Text fontSize="2xl">Sign Up for SpawnWrite</Text>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" onClick={handleSignUp} isLoading={loading} w="full">
          Sign Up
        </Button>
        <Button colorScheme="gray" onClick={handleGoogleSignUp} isLoading={loading} w="full">
          Sign Up with Google
        </Button>
        <Text>
          Already have an account?{' '}
          <Button variant="link" onClick={() => router.push('/auth/sign-in')}>
            Sign In
          </Button>
        </Text>
      </VStack>
    </Box>
  );
}