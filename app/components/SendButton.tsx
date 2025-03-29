'use client';

import { Button, useToast, VStack } from '@chakra-ui/react';
import { useState } from 'react';

type SendButtonProps = {
  subject: string;
  body: string;
  subdomain: string;
  recipientEmail: string;
};

export default function SendButton({
  subject,
  body,
  subdomain,
  recipientEmail,
}: SendButtonProps) {
  const toast = useToast();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleSend = async () => {
    if (!recipientEmail) {
      toast({
        title: 'Recipient Missing',
        description: 'Please enter a recipient email.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, subdomain, to: [recipientEmail] }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.queued) {
          toast({
            title: 'Email Queued',
            description: 'Email provider is down. Email queued for later delivery.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error(result.error || 'Failed to send email');
        }
      } else {
        console.log('Email sent successfully:', result);
        toast({
          title: 'Newsletter Sent',
          description: 'Your newsletter has been delivered!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error Sending Newsletter',
        description: 'Something went wrong. Check the console for details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await fetch('/api/send-email', { method: 'GET' });
      const result = await response.json();
      console.log('Retry results:', result);
      toast({
        title: 'Retry Attempted',
        description: `Processed ${result.results.length} emails. ${result.remaining} remain queued.`,
        status: result.remaining > 0 ? 'warning' : 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Retry error:', error);
      toast({
        title: 'Retry Failed',
        description: 'Could not retry queued emails.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <VStack spacing={2}>
      <Button onClick={handleSend} variant="solid" isDisabled={isRetrying}>
        Send Newsletter
      </Button>
      <Button
        onClick={handleRetry}
        variant="outline"
        isLoading={isRetrying}
        loadingText="Retrying..."
      >
        Retry Queued Emails
      </Button>
    </VStack>
  );
}