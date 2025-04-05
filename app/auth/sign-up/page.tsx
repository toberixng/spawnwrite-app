// app/auth/sign-up/page.tsx
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
  Checkbox,
  HStack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function SignUp() {
  const [firstName, setFirstName] = useState('Oluwatobi');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const isPasswordStrong = () => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return minLength && hasUppercase && hasNumber;
  };

  const checkEmailExists = async () => {
    const { data, error } = await supabaseClient
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    return data && !error;
  };

  const handleEmailSignUp = async () => {
    setError(null);
    setSuccess(false);

    if (!isPasswordStrong()) {
      setError('Password must be 8+ characters with an uppercase letter and a number.');
      return;
    }

    const emailExists = await checkEmailExists();
    if (emailExists) {
      setError('This email is already registered. Please sign in.');
      return;
    }

    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { username, first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      setSuccess(true);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
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
        <HStack position="absolute" bottom={4} left="50%" transform="translateX(-50%)">
          <Box w={2} h={2} bg="gray.400" borderRadius="full" />
          <Box w={2} h={2} bg="gray.400" borderRadius="full" />
          <Box w={2} h={2} bg="white" borderRadius="full" />
        </HStack>
      </Box>
      <Box flex={{ base: '1', md: 1 }} p={{ base: 4, md: 8 }} bg="gray.50" color="text">
        <VStack spacing={6} maxW="400px" mx="auto">
          <Heading size="lg" color="secondary">Create an account</Heading>
          <Text fontSize="sm">
            Already have an account?{' '}
            <Button variant="link" color="secondary" onClick={() => router.push('/auth/sign-in')}>
              Log in
            </Button>
          </Text>
          <VStack spacing={4} w="full">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              bg="white"
              color="gray.800"
              _placeholder={{ color: 'gray.500' }} // Visible placeholder
              borderColor="gray.300"
              _focus={{ borderColor: 'secondary' }}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              bg="white"
              color="gray.800"
              _placeholder={{ color: 'gray.500' }}
              borderColor="gray.300"
              _focus={{ borderColor: 'secondary' }}
            />
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
              <FormControl isInvalid={!!error && error.includes('Password')}>
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
                {error && error.includes('Password') && (
                  <FormErrorMessage>{error}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Checkbox
              isChecked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              colorScheme="secondary"
            >
              I agree to the{' '}
              <Button variant="link" color="secondary" as="a" href="/terms" target="_blank">
                Terms & Conditions
              </Button>
            </Checkbox>
            <Button
              w="full"
              bg="primary"
              color="white"
              _hover={{ bg: 'primary', opacity: 0.9 }}
              onClick={handleEmailSignUp}
              isDisabled={!agreeTerms}
            >
              Create account
            </Button>
            {error && !error.includes('Password') && <Text color="red.500">{error}</Text>}
            {success && (
              <Text color="green.500">
                Sign-up successful! Please check your email to confirm your account.
              </Text>
            )}
            <Button
              w="full"
              variant="outline"
              borderColor="gray.300"
              bg="white"
              color="gray.800"
              leftIcon={<Image src="https://www.google.com/favicon.ico" boxSize={4} />}
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}