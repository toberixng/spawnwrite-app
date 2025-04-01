// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Spinner, Center } from '@chakra-ui/react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push('/auth/sign-in');
        return;
      }

      const user = data.session.user;
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

      if (dbError || !userData) {
        const username = user.user_metadata.preferred_username || `user${user.id.slice(0, 8)}`;
        await supabase
          .from('users')
          .insert({ id: user.id, email: user.email, username, subscription_tier: 'free' });
        router.push(`/${username}`);
      } else {
        router.push(`/${userData.username}`);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}