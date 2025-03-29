'use client';

import { useState } from 'react';
import SubdomainLayout from './components/SubdomainLayout';
import Editor from './components/Editor';
import AIContentToolbar from './components/AIContentToolbar';
import PublishButton from './components/PublishButton';
import PaywallBanner from './components/PaywallBanner';
import SubscriptionModal from './components/SubscriptionModal';
import PostCard from './components/PostCard';
import NewsletterComposer from './components/NewsletterComposer';
import EmailPreview from './components/EmailPreview';
import SendButton from './components/SendButton';
import { getPostsBySubdomain } from './lib/postStore';
import { Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Button } from '@chakra-ui/react';

export default function Home({ params }: { params: { subdomain?: string } }) {
  const subdomain = params?.subdomain || 'testuser';
  const [content, setContent] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');

  const posts = getPostsBySubdomain(subdomain);

  const generateHeadline = () => {
    setContent(`<h1>${subdomain}'s Amazing Post</h1>` + content);
  };

  const summarize = () => {
    setContent(content.slice(0, 100) + '...');
  };

  const generateContent = () => {
    setContent(
      content +
        '<p>This is AI-generated content for your subdomain. Lorem ipsum dolor sit amet.</p>'
    );
  };

  // Mock AI subject line generator
  const generateSubject = () => {
    setNewsletterSubject(`Latest from ${subdomain}: Your Weekly Update`);
  };

  const handleSubscribeClick = () => {
    document.getElementById('subscribe-btn')?.click();
  };

  return (
    <SubdomainLayout subdomain={subdomain}>
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
              <PublishButton content={content} subdomain={subdomain} />
              {posts.map((post) =>
                post.isPaid && !isSubscribed ? (
                  <PaywallBanner key={post.id} onSubscribe={handleSubscribeClick} />
                ) : (
                  <PostCard key={post.id} post={post} isSubscribed={isSubscribed} />
                )
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Button onClick={generateSubject} variant="solid">
                Generate Subject
              </Button>
              <NewsletterComposer
                subject={newsletterSubject}
                setSubject={setNewsletterSubject}
                body={newsletterBody}
                setBody={setNewsletterBody}
              />
              <EmailPreview subject={newsletterSubject} body={newsletterBody} />
              <SendButton
                subject={newsletterSubject}
                body={newsletterBody}
                subdomain={subdomain}
              />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <SubscriptionModal
        subdomain={subdomain}
        onSubscribeSuccess={() => setIsSubscribed(true)}
      />
    </SubdomainLayout>
  );
}