// app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in');
      router.push('/auth/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!isSignedIn) {
    return null; // Redirect will handle this
  }

  return (
    <Box p={8}>
      <Heading>Dashboard</Heading>
      <Text mt={4}>Welcome, {user?.firstName || 'User'}!</Text>
    </Box>
  );
}