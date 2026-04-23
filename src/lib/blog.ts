import fs from 'fs';
import path from 'path';
import { BlogPost } from './blog.types';

export * from './blog.types';

const BLOG_DATA_PATH = path.join(process.cwd(), 'data/blog');

// Ensure directories exist
if (!fs.existsSync(BLOG_DATA_PATH)) {
  fs.mkdirSync(BLOG_DATA_PATH, { recursive: true });
}

const UPLOADS_PATH = path.join(process.cwd(), 'public/uploads/blog');
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DATA_PATH)) return [];
  
  const files = fs.readdirSync(BLOG_DATA_PATH);
  const posts = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(BLOG_DATA_PATH, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DATA_PATH, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as BlogPost;
}

export async function savePost(post: BlogPost): Promise<void> {
  const filePath = path.join(BLOG_DATA_PATH, `${post.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
}

export async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(BLOG_DATA_PATH, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
