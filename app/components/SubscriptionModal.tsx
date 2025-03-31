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

  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_fallback_key_for_debugging';

  // Debug: Log the key and environment details
  console.log('Environment:', process.env);
  console.log('Paystack Key in SubscriptionModal:', paystackKey);

  const { initializePayment } = usePaystack({
    email: 'user@example.com', // Replace with real user email later
    amount: 1000,
    publicKey: paystackKey,
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
    if (!paystackKey || paystackKey === 'pk_test_fallback_key_for_debugging') {
      console.error('Paystack public key is missing or using fallback. Check NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in environment variables.');
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