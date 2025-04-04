// app/[username]/page.tsx
import { createSupabaseServerClient } from '../../lib/supabaseServerClient';
import { Box, Heading, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';
import { currentUser } from '@clerk/nextjs/server';

export default async function Dashboard({ params }: { params: { username: string } }) {
  const user = await currentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  const supabase = createSupabaseServerClient();
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
      <Heading color="#333">Welcome, {params.username}!</Heading>
      <Text mt={4} color="#666">
        This is your dashboard. More features coming soon!
      </Text>
      <SignOutButton />
    </Box>
  );
}