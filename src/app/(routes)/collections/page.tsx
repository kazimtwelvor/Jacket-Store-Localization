export const dynamic = "force-dynamic";


import type { Metadata } from 'next';
import CategoriesPage from './page-client';
import getKeywordCategories from '@/src/app/actions/get-keyword-categories';

export const metadata: Metadata = {
  title: 'All Categories | Jackets Store',
  description: 'Browse all our jacket categories and find your perfect style.',
};

export default async function Categories() {
  try {
    const keywordCategories = await getKeywordCategories();
    console.log('Collections page - keyword categories:', keywordCategories.length);
    
    // If no keyword categories, we could also fetch regular categories as fallback
    if (keywordCategories.length === 0) {
      console.log('No keyword categories found, this is expected if none are configured');
    }
    
    return <CategoriesPage categories={keywordCategories} />;
  } catch (error) {
    console.error('Error in Collections page:', error);
    return <CategoriesPage categories={[]} />;
  }
}
