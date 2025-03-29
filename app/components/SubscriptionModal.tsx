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

  const handleSubscribe = () => {
    // Simulate Paystack payment (replace with real integration later)
    setTimeout(() => {
      toast({
        title: 'Subscription Successful',
        description: `You’re now subscribed to ${subdomain}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSubscribeSuccess();
      onClose();
    }, 1000); // Simulate network delay
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
            Unlock all paid content for {subdomain} with a subscription.
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