'use client';

import { useState } from 'react';
import { VStack, Button, Input, Select, Text, Box } from '@chakra-ui/react';

type Provider = {
  name: string;
  apiKey: string;
  priority: number; // 1-5, 1 is highest
};

export default function EmailProvidersAdmin() {
  const [providers, setProviders] = useState<Provider[]>([
    { name: 'Resend', apiKey: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxx', priority: 1 },
  ]);
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [priority, setPriority] = useState(1);

  const addProvider = async () => {
    if (providers.length >= 5) {
      alert('Maximum 5 providers allowed.');
      return;
    }
    if (providers.some((p) => p.priority === priority)) {
      alert('Priority already in use. Adjust existing priorities first.');
      return;
    }
    const newProvider = { name, apiKey, priority };
    setProviders([...providers, newProvider]);
    await fetch('/api/email-providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProvider),
    });
    setName('');
    setApiKey('');
    setPriority(1);
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Configure Email Providers
      </Text>
      <VStack spacing={4} align="stretch">
        {providers.map((provider) => (
          <Box key={provider.priority} p={2} borderWidth={1}>
            <Text>
              {provider.name} (Priority: {provider.priority}) - {provider.apiKey}
            </Text>
          </Box>
        ))}
        <Select value={name} onChange={(e) => setName(e.target.value)} placeholder="Select Provider">
          <option value="Resend">Resend</option>
          <option value="SendGrid">SendGrid</option>
          <option value="Mailgun">Mailgun</option>
          <option value="Amazon SES">Amazon SES</option>
          <option value="SMTP.com">SMTP.com</option>
        </Select>
        <Input
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              Priority {p}
            </option>
          ))}
        </Select>
        <Button onClick={addProvider} colorScheme="teal">
          Add Provider
        </Button>
      </VStack>
    </Box>
  );
}