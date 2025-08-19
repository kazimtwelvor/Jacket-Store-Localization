export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

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
    return <CategoriesPage categories={keywordCategories || []} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Collections</h1>
          <p className="text-gray-600">Unable to load collections at this time.</p>
        </div>
      </div>
    );
  }
}
