import { Alert, AlertIcon, Button, Text } from '@chakra-ui/react';

type PaywallBannerProps = {
  onSubscribe: () => void;
};

export default function PaywallBanner({ onSubscribe }: PaywallBannerProps) {
  return (
    <Alert status="warning" bg="gray.100" borderRadius="md" p={4}>
      <AlertIcon color="accent.500" />
      <Text flex="1">This is paid content. Subscribe to access it!</Text>
      <Button onClick={onSubscribe} variant="solid" ml={4}>
        Subscribe
      </Button>
    </Alert>
  );
}