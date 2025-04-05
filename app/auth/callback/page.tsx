// app/auth/callback/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Spinner, Center } from '@chakra-ui/react';

export default function AuthCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: '/dashboard',
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    }).then(() => {
      router.push('/dashboard');
    }).catch((err) => {
      console.error('Callback error:', err);
      router.push('/auth/sign-in?error=Authentication%20failed');
    });
  }, [handleRedirectCallback, router]);

  return (
    <Center minH="100vh">
      <Spinner size="xl" />
    </Center>
  );
}