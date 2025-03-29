import SubdomainLayout from './components/SubdomainLayout';

export default function Home({ params }: { params: { subdomain?: string } }) {
  // Use params.subdomain if available, fallback to 'testuser'
  const subdomain = params?.subdomain || 'testuser';
  return (
    <SubdomainLayout subdomain={subdomain}>
      <h1>Welcome to {subdomain}&apos;s Page</h1>
      <p>This is a sample page for your subdomain.</p>
    </SubdomainLayout>
  );
}