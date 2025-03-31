// app/components/SendButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import mixpanel from '../lib/mixpanel';

interface SendButtonProps {
  subject: string;
  body: string;
  subdomain: string;
  recipientEmail: string;
  onBeforeSend?: () => boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SendButton({
  subject,
  body,
  subdomain,
  recipientEmail,
  onBeforeSend,
  onSuccess,
  onError,
}: SendButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = async () => {
    if (isSending || isSent) return;
    if (onBeforeSend && !onBeforeSend()) return;

    setIsSending(true);
    mixpanel.track('Send Newsletter Attempt', { subdomain, recipientEmail });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, subdomain, to: recipientEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setIsSending(false);
      setIsSent(true);
      mixpanel.track('Send Newsletter Success', { subdomain, recipientEmail });
      if (onSuccess) onSuccess();
      setTimeout(() => setIsSent(false), 2000);
    } catch (error) {
      setIsSending(false);
      mixpanel.track('Send Newsletter Failed', {
        subdomain,
        recipientEmail,
        error: (error as Error).message,
      });
      if (onError) onError((error as Error).message);
    }
  };

  return (
    <Button
      onClick={handleSend}
      colorScheme="yellow"
      w="fit-content"
      px={4}
      isDisabled={!subject || !body || !recipientEmail || isSending || isSent}
      isLoading={isSending}
      loadingText="Sending..."
    >
      {isSent ? 'Success' : 'Send Newsletter'}
    </Button>
  );
}