

import type { Metadata } from 'next';
import CategoriesPage from './page-client';
import getKeywordCategories from '@/actions/get-keyword-categories';

export const metadata: Metadata = {
  title: 'All Categories | Jackets Store',
  description: 'Browse all our jacket categories and find your perfect style.',
};

export default async function Categories() {
  const categories = await getKeywordCategories();
  
  return <CategoriesPage categories={categories} />;
}
