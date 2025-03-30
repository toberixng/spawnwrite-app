'use client';

import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { usePaystack } from '../hooks/usePaystack';

interface SubscriptionModalProps {
  subdomain: string;
  onSubscribeSuccess: () => void;
}

export default function SubscriptionModal({ subdomain, onSubscribeSuccess }: SubscriptionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Replace with your Paystack Test Public Key
  const PAYSTACK_PUBLIC_KEY = 'pk_test_5ebc0e092a7e842e99b3ed4d405554b875a99ae0';
  const { initializePayment } = usePaystack({
    email: 'user@example.com', // Replace with real user email (e.g., from auth)
    amount: 1000, // Example amount in NGN (adjust as needed)
    publicKey: PAYSTACK_PUBLIC_KEY,
    onSuccess: () => {
      setIsOpen(false);
      onSubscribeSuccess();
    },
    onClose: () => {
      setIsOpen(false);
    },
  });

  const handleSubscribe = () => {
    initializePayment();
  };

  return (
    <>
      <Button id="subscribe-btn" onClick={() => setIsOpen(true)} style={{ display: 'none' }}>
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