'use client';

import { Button, useToast } from '@chakra-ui/react';
import { Resend } from 'resend';

type SendButtonProps = {
  subject: string;
  body: string;
  subdomain: string;
};

export default function SendButton({ subject, body, subdomain }: SendButtonProps) {
  const toast = useToast();
  const resend = new Resend('re_8EeDKiH5_GF4wBA4eu1pWPMFY7X4mHt7q'); // Replace with your Resend API key

  const handleSend = async () => {
    try {
      await resend.emails.send({
        from: `onboarding@resend.dev`, // Requires domain setup in Resend
        to: 'test@example.com', // Replace with real subscriber list later
        subject,
        text: body,
      });
      toast({
        title: 'Newsletter Sent',
        description: 'Your newsletter has been delivered!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error Sending Newsletter',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Button onClick={handleSend} variant="solid">
      Send Newsletter
    </Button>
  );
}