'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { usePaystack } from '../hooks/usePaystack';

type SubscriptionModalProps = {
  subdomain: string;
  onSubscribeSuccess: () => void;
};

export default function SubscriptionModal({
  subdomain,
  onSubscribeSuccess,
}: SubscriptionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Replace with your Paystack Test Public Key
  const PAYSTACK_PUBLIC_KEY = 'pk_test_5ebc0e092a7e842e99b3ed4d405554b875a99ae0';
  const { initializePayment } = usePaystack(PAYSTACK_PUBLIC_KEY);

  const handleSubscribe = () => {
    initializePayment({
      email: `${subdomain}@example.com`, // Replace with real user email later
      amount: 100000, // 1000 NGN (100,000 kobo) for testing
      onSuccess: (response) => {
        toast({
          title: 'Subscription Successful',
          description: `You’re now subscribed to ${subdomain}! Ref: ${response.reference}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onSubscribeSuccess();
        onClose();
      },
      onClose: () => {
        toast({
          title: 'Payment Cancelled',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <>
      <Button onClick={onOpen} variant="solid" display="none" id="subscribe-btn">
        Subscribe
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="primary.500">
            Subscribe to {subdomain}
          </ModalHeader>
          <ModalBody>
            Unlock all paid content for {subdomain} for 1000 NGN.
          </ModalBody>
          <ModalFooter>
            <Button variant="solid" onClick={handleSubscribe}>
              Pay with Paystack
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}