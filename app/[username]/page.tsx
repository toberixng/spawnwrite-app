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
import { supabase } from '../lib/supabase';
import { Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Button, Input, Text, useToast } from '@chakra-ui/react';

export default function UserPage({ params }: { params: { username: string } }) {
  const username = params.username;
  const [content, setContent] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const toast = useToast();

  // Fetch posts from Supabase when the page loads
  useEffect(() => {
    const fetchPosts = async () => {
      // First, get or create the user
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user:', userError);
        return;
      }

      if (!user) {
        // If user doesn't exist, create one
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({ username, email: `${username}@example.com` })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          return;
        }
        user = newUser;
      }

      // Fetch posts for this user
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    };

    fetchPosts();
  }, [username]);

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
      <Tabs variant="soft-rounded" colorScheme="yellow">
        <TabList>
          <Tab>Create Post</Tab>
          <Tab>Newsletter</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <AIContentToolbar
                onGenerateHeadline={generateHeadline}
                onSummarize={summarize}
                onGenerateContent={generateContent}
              />
              <Editor value={content} onChange={setContent} />
              <PublishButton content={content} subdomain={username} />
              {posts.map((post) =>
                post.is_paid && !isSubscribed ? (
                  <PaywallBanner key={post.id} onSubscribe={handleSubscribeClick} />
                ) : (
                  <PostCard key={post.id} post={post} isSubscribed={isSubscribed} />
                )
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Button onClick={generateSubject} variant="solid" size="lg">
                Generate Subject
              </Button>
              <Button onClick={generateNewsletterContent} variant="solid" size="lg">
                Generate Content
              </Button>
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
                w="fit-content"
                px={4}
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