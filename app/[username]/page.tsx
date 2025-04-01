// app/[username]/page.tsx
import { createSupabaseServerClient } from '../../lib/supabaseServerClient'; // Updated import
import { Box, Heading, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';

export default async function Dashboard({ params }: { params: { username: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/auth/sign-in');
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  if (error || !userData || userData.username !== params.username) {
    redirect('/auth/sign-in');
  }

  return (
    <Box maxW="3xl" mx="auto" mt={10} p={5}>
      <Heading>Welcome, {params.username}!</Heading>
      <Text mt={4}>This is your dashboard. More features coming soon!</Text>
      <SignOutButton />
    </Box>
  );
}