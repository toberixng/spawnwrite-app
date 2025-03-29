'use client';

import { useState } from 'react';
import SubdomainLayout from './components/SubdomainLayout';
import Editor from './components/Editor';
import AIContentToolbar from './components/AIContentToolbar';
import PublishButton from './components/PublishButton';
import PaywallBanner from './components/PaywallBanner';
import SubscriptionModal from './components/SubscriptionModal';
import PostCard from './components/PostCard';
import { getPostsBySubdomain } from './lib/postStore';
import { VStack } from '@chakra-ui/react';

export default function Home({ params }: { params: { subdomain?: string } }) {
  const subdomain = params?.subdomain || 'testuser';
  const [content, setContent] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  const handleSubscribeClick = () => {
    document.getElementById('subscribe-btn')?.click();
  };

  return (
    <SubdomainLayout subdomain={subdomain}>
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
      <SubscriptionModal
        subdomain={subdomain}
        onSubscribeSuccess={() => setIsSubscribed(true)}
      />
    </SubdomainLayout>
  );
}