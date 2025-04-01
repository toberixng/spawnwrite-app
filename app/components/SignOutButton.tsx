// app/components/SignOutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react';
import { createSupabaseBrowserClient } from '../../lib/supabaseBrowserClient'; // Updated import

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/sign-in');
  };

  return (
    <Button colorScheme="red" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}