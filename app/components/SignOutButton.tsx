// app/components/SignOutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@clerk/nextjs';

export default function SignOutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/sign-in');
  };

  return (
    <Button
      bg="#1A3C34"
      color="white"
      onClick={handleSignOut}
      mt={4}
      _hover={{ bg: '#2A5C54' }}
    >
      Sign Out
    </Button>
  );
}