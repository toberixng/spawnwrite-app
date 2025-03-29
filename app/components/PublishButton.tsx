'use client';

import { Button, Checkbox, Flex, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { addPost } from '../lib/postStore';
import { Post } from '../lib/types';

type PublishButtonProps = {
  content: string;
  subdomain: string;
};

export default function PublishButton({ content, subdomain }: PublishButtonProps) {
  const [isPaid, setIsPaid] = useState(false);
  const toast = useToast();

  const handlePublish = () => {
    const post: Post = {
      id: Math.random().toString(36).substring(2), // Simple random ID
      title: content.match(/<h1>(.*?)<\/h1>/)?.[1] || 'Untitled',
      content,
      isPaid,
      subdomain,
      publishedAt: new Date().toISOString(),
    };

    addPost(post);
    toast({
      title: 'Post Published',
      description: `Your ${isPaid ? 'paid' : 'free'} post is live!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex gap={4} align="center">
      <Checkbox isChecked={isPaid} onChange={(e) => setIsPaid(e.target.checked)}>
        Paid Content
      </Checkbox>
      <Button onClick={handlePublish} variant="solid">
        Publish
      </Button>
    </Flex>
  );
}