'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';

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
    if (isSending || isSent) return; // Prevent double-clicks

    if (onBeforeSend && !onBeforeSend()) {
      return;
    }

    setIsSending(true); // Show "Sending..."

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

      setIsSending(false); // Done sending
      setIsSent(true); // Show "Success"
      if (onSuccess) onSuccess();

      // Reset to "Send Newsletter" after 2 seconds
      setTimeout(() => setIsSent(false), 2000);
    } catch (error) {
      setIsSending(false); // Reset on error
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
      isLoading={isSending} // Chakra's loading spinner
      loadingText="Sending..." // Text during send
    >
      {isSent ? 'Success' : 'Send Newsletter'}
    </Button>
  );
}