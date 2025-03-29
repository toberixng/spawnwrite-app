'use client';

import { FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';

type NewsletterComposerProps = {
  subject: string;
  setSubject: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
};

export default function NewsletterComposer({
  subject,
  setSubject,
  body,
  setBody,
}: NewsletterComposerProps) {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel color="primary.500">Subject</FormLabel>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter newsletter subject"
          borderColor="gray.200"
        />
      </FormControl>
      <FormControl>
        <FormLabel color="primary.500">Body</FormLabel>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your newsletter content"
          minH="200px"
          borderColor="gray.200"
        />
      </FormControl>
    </VStack>
  );
}