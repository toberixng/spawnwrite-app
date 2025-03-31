// app/components/SubscriptionModal.tsx
'use client';

import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { usePaystack } from '../hooks/usePaystack';
import mixpanel from '../lib/mixpanel';

interface SubscriptionModalProps {
  subdomain: string;
  onSubscribeSuccess: () => void;
}

export default function SubscriptionModal({ subdomain, onSubscribeSuccess }: SubscriptionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { initializePayment } = usePaystack({
    email: 'user@example.com', // Replace with real user email later
    amount: 1000,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    onSuccess: () => {
      setIsOpen(false);
      onSubscribeSuccess();
      mixpanel.track('Subscription Success', { subdomain });
    },
    onClose: () => {
      setIsOpen(false);
      mixpanel.track('Subscription Closed', { subdomain });
    },
  });

  const handleSubscribe = () => {
    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      console.error('Paystack public key is missing');
      return;
    }
    mixpanel.track('Subscription Attempt', { subdomain });
    initializePayment();
  };

  return (
    <>
      <Button
        id="subscribe-btn"
        onClick={() => setIsOpen(true)}
        style={{ display: 'none' }}
      >
        Subscribe
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Subscribe to {subdomain}</ModalHeader>
          <ModalBody>
            <p>Unlock premium content for just ₦1000!</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" onClick={handleSubscribe}>
              Pay with Paystack
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}