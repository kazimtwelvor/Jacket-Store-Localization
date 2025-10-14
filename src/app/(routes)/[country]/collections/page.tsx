export const revalidate = 1800; // ISR: Revalidate every 30 minutes

import type { Metadata } from 'next';
import CategoriesPage from './page-client';
import getKeywordCategories from '@/src/app/actions/get-keyword-categories';

export const metadata: Metadata = {
  title: 'All Categories | Jackets Store',
  description: 'Explore FINEYST\'s complete collection of premium jackets and outerwear. From leather jackets to winter coats, find your perfect style with free shipping on orders over $100.',
  alternates: {
    canonical: "https://www.fineystjackets.com/us/collections"
  }
};

export default async function Categories({ params }: { params: { country: string } }) {
  const countryCode = params.country;
  
  try {
    const keywordCategories = await getKeywordCategories();
    return <CategoriesPage categories={keywordCategories || []} countryCode={countryCode} />;
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
