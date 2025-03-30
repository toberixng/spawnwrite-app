type Post = {
  id: string;
  subdomain: string;
  title: string;
  content: string;
  isPaid: boolean;
  publishedAt: string;
};

// eslint-disable-next-line prefer-const
let posts: Post[] = [
  { id: '1', subdomain: 'testuser', title: 'First Post', content: '<p>Welcome!</p>', isPaid: false, publishedAt: '2025-03-28T10:00:00Z' },
  { id: '2', subdomain: 'testuser', title: 'Premium Content', content: '<p>Exclusive.</p>', isPaid: true, publishedAt: '2025-03-29T12:00:00Z' },
];

export function getPostsBySubdomain(subdomain: string): Post[] {
  return posts.filter((post) => post.subdomain === subdomain);
}

export function addPost(post: Omit<Post, 'id' | 'publishedAt'>) {
  const newPost = { ...post, id: `${Date.now()}`, publishedAt: new Date().toISOString() };
  posts.push(newPost);
}