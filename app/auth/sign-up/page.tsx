// app/auth/sign-up/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
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
  const [code, setCode] = useState(''); // For verification code
  const [isVerifying, setIsVerifying] = useState(false); // Toggle verification step
  const [isLoading, setIsLoading] = useState(false); // Prevent double-click
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();

  if (!isLoaded) return <Text>Loading...</Text>;

  const isPasswordStrong = () => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return minLength && hasUppercase && hasNumber;
  };

  const handleEmailSignUp = async () => {
    if (isLoading) return; // Prevent double-click
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions.');
      setIsLoading(false);
      return;
    }

    if (!isPasswordStrong()) {
      setError('Password must be 8+ characters with an uppercase letter and a number.');
      setIsLoading(false);
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setSuccess(true);
      setIsVerifying(true); // Show code input
    } catch (err: any) {
      console.error('Sign-up error:', err);
      setError(err.errors?.[0]?.message || 'Sign-up failed: Unknown error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (isLoading) return; // Prevent double-click
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (result.status === 'complete') {
        router.push('/dashboard');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isLoading) return; // Prevent double-click
    setIsLoading(true);
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google sign-up failed.');
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
          <Heading size="lg" color="primary">Create an account</Heading>
          <Text fontSize="sm" color="black">
            Already have an account?{' '}
            <Button variant="link" color="black" onClick={() => router.push('/auth/sign-in')}>
              Log in
            </Button>
          </Text>
          <VStack spacing={4} w="full">
            {!isVerifying ? (
              <>
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  bg="white"
                  color="gray.800"
                  _placeholder={{ color: 'gray.500' }}
                  borderColor="gray.300"
                  _focus={{ borderColor: 'primary' }}
                />
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  bg="white"
                  color="gray.800"
                  _placeholder={{ color: 'gray.500' }}
                  borderColor="gray.300"
                  _focus={{ borderColor: 'primary' }}
                />
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
                    {error && error.includes('Password') && (
                      <FormErrorMessage>{error}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Checkbox
                  isChecked={agreeTerms}
                  onChange={(e) => {
                    console.log('Checkbox toggled to:', e.target.checked);
                    setAgreeTerms(e.target.checked);
                  }}
                  colorScheme="primary"
                  size="md"
                  iconColor="white"
                >
                  <Text color="black">
                    I agree to the{' '}
                    <Button variant="link" color="black" as="a" href="/terms" target="_blank">
                      Terms & Conditions
                    </Button>
                  </Text>
                </Checkbox>
                <Button
                  w="full"
                  bg="#121C27"
                  color="#b8c103"
                  _hover={{ bg: '#b8c103', color: '#121C27' }}
                  onClick={handleEmailSignUp}
                  isDisabled={!agreeTerms || isLoading}
                  isLoading={isLoading}
                >
                  Create account
                </Button>
                {error && !error.includes('Password') && <Text color="red.500">{error}</Text>}
                {success && (
                  <Text color="green.500">
                    Sign-up successful! Please check your email for a verification code.
                  </Text>
                )}
                <Button
                  w="full"
                  variant="outline"
                  borderColor="gray.300"
                  bg="white"
                  color="black"
                  leftIcon={<Image src="https://www.google.com/favicon.ico" boxSize={4} />}
                  onClick={handleGoogleSignUp}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                >
                  Sign up with Google
                </Button>
              </>
            ) : (
              <>
                <Input
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  bg="white"
                  color="gray.800"
                  _placeholder={{ color: 'gray.500' }}
                  borderColor="gray.300"
                  _focus={{ borderColor: 'primary' }}
                />
                <Button
                  w="full"
                  bg="#121C27"
                  color="#b8c103"
                  _hover={{ bg: '#b8c103', color: '#121C27' }}
                  onClick={handleVerifyCode}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                >
                  Verify Code
                </Button>
                {error && <Text color="red.500">{error}</Text>}
              </>
            )}
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}