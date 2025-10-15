import { unstable_cache } from "next/cache";
import BlogsShowcaseClient from "@/src/app/components/home-page-components/blog-showcase/blog-showcase-client";

export const revalidate = 3600; 

interface BlogItem {
  id: string;
  title: string;
  excerpt?: string;
  description?: string;
  image: string;
  link: string;
  author?: string;
  date?: string;
  category?: string;
  readTime?: string;
}

const getCachedBlogData = unstable_cache(
  async (): Promise<BlogItem[]> => {
    return [];
  },
  ['blog-showcase'],
  { revalidate: 3600, tags: ['blogs'] }
);

interface BlogsShowcaseServerProps {
  countryCode: string;
}

export default async function BlogsShowcaseServer({ countryCode }: BlogsShowcaseServerProps) {
  const blogItems = await getCachedBlogData();

  return <BlogsShowcaseClient blogItems={blogItems} countryCode={countryCode} />;
}
