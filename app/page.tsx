'use client'; // Required for state and client-side components

import { useState } from 'react';
import SubdomainLayout from './components/SubdomainLayout';
import Editor from './components/Editor';
import AIContentToolbar from './components/AIContentToolbar';

export default function Home({ params }: { params: { subdomain?: string } }) {
  const subdomain = params?.subdomain || 'testuser';
  const [content, setContent] = useState('');

  // Placeholder AI functions (simulating Qwen)
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

  return (
    <SubdomainLayout subdomain={subdomain}>
      <AIContentToolbar
        onGenerateHeadline={generateHeadline}
        onSummarize={summarize}
        onGenerateContent={generateContent}
      />
      <Editor value={content} onChange={setContent} />
    </SubdomainLayout>
  );
}