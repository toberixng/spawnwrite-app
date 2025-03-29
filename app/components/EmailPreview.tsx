import { Box, Heading, Text } from '@chakra-ui/react';

type EmailPreviewProps = {
  subject: string;
  body: string;
};

export default function EmailPreview({ subject, body }: EmailPreviewProps) {
  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg="white">
      <Heading size="md" color="primary.500">
        {subject || 'Subject Preview'}
      </Heading>
      <Text mt={2} whiteSpace="pre-wrap">
        {body || 'Body preview will appear here.'}
      </Text>
    </Box>
  );
}