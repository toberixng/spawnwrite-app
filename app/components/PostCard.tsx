import { Box, Heading, Text } from '@chakra-ui/react';
import { Post } from '../lib/types';

type PostCardProps = {
  post: Post;
  isSubscribed: boolean;
};

export default function PostCard({ post, isSubscribed }: PostCardProps) {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      bg="white"
      mb={4}
    >
      <Heading size="md">{post.title}</Heading>
      <Text mt={2} color="gray.600">
        Published on {new Date(post.publishedAt).toLocaleDateString()}
      </Text>
      {post.isPaid && !isSubscribed ? (
        <Text mt={2}>[Paywall Content]</Text>
      ) : (
        <Box mt={2} dangerouslySetInnerHTML={{ __html: post.content }} />
      )}
    </Box>
  );
}