// app/components/PublishButton.tsx
'use client';

import { Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';

interface PublishButtonProps {
  content: string;
  subdomain: string;
}

export default function PublishButton({ content, subdomain }: PublishButtonProps) {
  const toast = useToast();
  const [isPublishing, setIsPublishing] = useState(false); // New: Loading state

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
      setIsPublishing(true); // Start loading

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: subdomain,
          content,
          is_paid: false, // For now, all posts are free
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish post');
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
    } finally {
      setIsPublishing(false); // Stop loading
    }
  };

  return (
    <Button
      onClick={handlePublish}
      colorScheme="green"
      isLoading={isPublishing} // Show loading spinner on the button
      loadingText="Publishing..." // Text during loading
    >
      Publish
    </Button>
  );
}