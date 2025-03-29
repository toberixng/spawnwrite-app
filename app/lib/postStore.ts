import { Post } from './types';

let posts: Post[] = [];

export const addPost = (post: Post) => {
  posts.push(post);
};

export const getPostsBySubdomain = (subdomain: string): Post[] => {
  return posts.filter((post) => post.subdomain === subdomain);
};