// app/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SubdomainLayout from '../components/SubdomainLayout';
import Editor from '../components/Editor';
import AIContentToolbar from '../components/AIContentToolbar';
import PublishButton from '../components/PublishButton';
import PaywallBanner from '../components/PaywallBanner';
import SubscriptionModal from '../components/SubscriptionModal';
import PostCard from '../components/PostCard';
import NewsletterComposer from '../components/NewsletterComposer';
import EmailPreview from '../components/EmailPreview';
import SendButton from '../components/SendButton';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Button,
  Input,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Divider,
} from '@chakra-ui/react';

export default function UserPage({ params }: { params: { username: string } }) {
  const username = params.username;
  const [content, setContent] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Fetch posts from the API route when the page loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/posts?username=${username}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts');
        }

        setPosts(data.posts);
      } catch (error) {
        const errorMessage = (error as Error).message || 'Failed to fetch posts';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [username, toast]);

  const generateHeadline = () => {
    setContent(`<h1>${username}'s Amazing Post</h1>` + content);
  };

  const summarize = () => {
    setContent(content.slice(0, 100) + '...');
  };

  const generateContent = () => {
    setContent(
      content +
        '<p>This is AI-generated content for your page. Lorem ipsum dolor sit amet.</p>'
    );
  };

  const generateSubject = () => {
    setNewsletterSubject(`Latest from ${username}: Your Weekly Update`);
  };

  const generateNewsletterContent = () => {
    setNewsletterBody(
      `Hello subscribers of ${username}!\n\nThis is your latest newsletter, crafted with AI. Here’s what’s new: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enjoy exclusive updates from ${username}, and stay tuned for more!\n\nBest,\nThe ${username} Team`
    );
  };

  const handleSubscribeClick = () => {
    document.getElementById('subscribe-btn')?.click();
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRetryQueuedEmails = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'GET',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to retry queued emails');
      }
      toast({
        title: 'Retry Successful',
        description: 'Queued emails have been processed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Retry Failed',
        description: (error as Error).message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <SubdomainLayout subdomain={username}>
      <Tabs variant="soft-rounded" colorScheme="yellow" isFitted>
        <TabList mb={6}>
          <Tab
            fontWeight="medium"
            fontSize="lg"
            _selected={{ bg: 'yellow.400', color: 'white', boxShadow: 'md' }}
          >
            Create Post
          </Tab>
          <Tab
            fontWeight="medium"
            fontSize="lg"
            _selected={{ bg: 'yellow.400', color: 'white', boxShadow: 'md' }}
          >
            Newsletter
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              <AIContentToolbar
                onGenerateHeadline={generateHeadline}
                onSummarize={summarize}
                onGenerateContent={generateContent}
              />
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                bg="gray.50"
              >
                <Editor value={content} onChange={setContent} />
              </Box>
              <PublishButton content={content} subdomain={username} />
              <Divider />
              {isLoading ? (
                <Box textAlign="center" py={4}>
                  <Spinner size="lg" color="yellow.500" />
                  <Text mt={2} color="gray.600">
                    Loading posts...
                  </Text>
                </Box>
              ) : error ? (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Box>
                </Alert>
              ) : posts.length === 0 ? (
                <Text textAlign="center" color="gray.500" fontSize="lg">
                  No posts yet. Create your first post above!
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {posts.map((post) =>
                    post.is_paid && !isSubscribed ? (
                      <PaywallBanner key={post.id} onSubscribe={handleSubscribeClick} />
                    ) : (
                      <PostCard key={post.id} post={post} isSubscribed={isSubscribed} />
                    )
                  )}
                </VStack>
              )}
            </VStack>
          </TabPanel>
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Button
                  onClick={generateSubject}
                  variant="solid"
                  colorScheme="yellow"
                  size="lg"
                  w="full"
                  mb={3}
                >
                  Generate Subject
                </Button>
                <Button
                  onClick={generateNewsletterContent}
                  variant="solid"
                  colorScheme="yellow"
                  size="lg"
                  w="full"
                >
                  Generate Content
                </Button>
              </Box>
              <NewsletterComposer
                subject={newsletterSubject}
                setSubject={setNewsletterSubject}
                body={newsletterBody}
                setBody={setNewsletterBody}
              />
              <EmailPreview subject={newsletterSubject} body={newsletterBody} />
              <Input
                placeholder="Recipient Email (e.g., myemail@gmail.com)"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                borderColor="gray.200"
                size="lg"
                borderRadius="md"
              />
              {!isValidEmail(recipientEmail) && recipientEmail.length > 0 && (
                <Text color="red.500" fontSize="sm">
                  Please enter a valid email address (e.g., user@example.com)
                </Text>
              )}
              <SendButton
                subject={newsletterSubject}
                body={newsletterBody}
                subdomain={username}
                recipientEmail={recipientEmail}
                onBeforeSend={() => {
                  if (!isValidEmail(recipientEmail)) {
                    toast({
                      title: 'Invalid Email',
                      description: 'Please enter a valid email address.',
                      status: 'error',
                      duration: 3000,
                      isClosable: true,
                    });
                    return false;
                  }
                  return true;
                }}
                onSuccess={() => {
                  toast({
                    title: 'Email Sent',
                    description: `Newsletter sent to ${recipientEmail}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  setRecipientEmail('');
                }}
                onError={(error) => {
                  toast({
                    title: 'Send Failed',
                    description: error || 'Something went wrong. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              />
              <Button
                onClick={handleRetryQueuedEmails}
                colorScheme="blue"
                w="full"
                size="lg"
                isDisabled={!recipientEmail}
              >
                Retry Queued Emails
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <SubscriptionModal
        subdomain={username}
        onSubscribeSuccess={() => setIsSubscribed(true)}
      />
    </SubdomainLayout>
  );
}