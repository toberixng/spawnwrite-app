// app/auth/sign-in/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { createSupabaseBrowserClient } from '../../../lib/supabaseBrowserClient'; // Updated import
import { AuthError } from '@supabase/supabase-js';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const supabase = createSupabaseBrowserClient();

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      if (user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();

        if (dbError || !userData) {
          throw new Error('User not found in database');
        }

        await router.push(`/${userData.username}`);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="md">
      <VStack spacing={4}>
        <Text fontSize="2xl">Sign In to SpawnWrite</Text>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" onClick={handleSignIn} isLoading={loading} w="full">
          Sign In
        </Button>
        <Button colorScheme="gray" onClick={handleGoogleSignIn} isLoading={loading} w="full">
          Sign In with Google
        </Button>
        <Text>
          Don’t have an account?{' '}
          <Button variant="link" onClick={() => router.push('/auth/sign-up')}>
            Sign Up
          </Button>
        </Text>
      </VStack>
    </Box>
  );
}