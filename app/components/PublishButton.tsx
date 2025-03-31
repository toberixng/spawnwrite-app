// app/components/PublishButton.tsx
'use client';

import { Button, useToast } from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

interface PublishButtonProps {
  content: string;
  subdomain: string;
}

export default function PublishButton({ content, subdomain }: PublishButtonProps) {
  const toast = useToast();

  const handlePublish = async () => {
    if (!content) {
      toast({
        title: 'Error',
        description: 'Content cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Get or create the user
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', subdomain)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw new Error('Error fetching user: ' + userError.message);
      }

      if (!user) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({ username: subdomain, email: `${subdomain}@example.com` })
          .select('id')
          .single();

        if (createError) {
          throw new Error('Error creating user: ' + createError.message);
        }
        user = newUser;
      }

      // Save the post to Supabase
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content,
        is_paid: false, // For now, all posts are free; we'll add paid logic later
      });

      if (error) {
        throw new Error('Error publishing post: ' + error.message);
      }

      toast({
        title: 'Post Published',
        description: 'Your post has been published successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh the page to show the new post
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to publish post',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button onClick={handlePublish} colorScheme="green">
      Publish
    </Button>
  );
}