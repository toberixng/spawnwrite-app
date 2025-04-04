// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../lib/supabaseServerClient';
import { Box, Heading, Text } from '@chakra-ui/react';
import SignOutButton from '../components/SignOutButton';

export default async function Dashboard() {
  const { userId } = auth();

  // If the user is not authenticated, redirect to sign-in
  if (!userId) {
    redirect('/auth/sign-in');
  }

  // Fetch user data from Supabase
  const supabase = createSupabaseServerClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('email, username, first_name, last_name, subscription_tier')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return (
      <Box p={4}>
        <Heading as="h1" size="xl" mb={4}>
          Dashboard
        </Heading>
        <Text color="red.500">Error loading user data: {error?.message || 'User not found'}</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Dashboard
      </Heading>
      <Text fontSize="lg" mb={2}>
        Welcome, {user.first_name || user.username || 'User'}!
      </Text>
      <Text mb={2}>Email: {user.email}</Text>
      <Text mb={2}>Username: {user.username || 'Not set'}</Text>
      <Text mb={2}>Subscription Tier: {user.subscription_tier}</Text>
      <SignOutButton />
    </Box>
  );
}