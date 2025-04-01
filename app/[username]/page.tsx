// app/[username]/page.tsx
import { supabase } from '../../lib/supabase';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { redirect } from 'next/navigation';

export default async function Dashboard({ params }: { params: { username: string } }) {
  const { data: session } = await supabase.auth.getSession();
  const user = session?.session?.user;

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
      <Button
        mt={4}
        colorScheme="red"
        onClick={async () => {
          await supabase.auth.signOut();
          redirect('/auth/sign-in');
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
}