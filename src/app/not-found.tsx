import Link from 'next/link'
import { headers } from 'next/headers'

export default function NotFound() {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''
  const countryCode = pathname.split('/')[1] || 'us'
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href={`/${countryCode}/`}
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-400">
            <Link href={`/${countryCode}/shop`} className="hover:text-gray-600 transition-colors">
              Browse Products
            </Link>
            {' • '}
            <Link href={`/${countryCode}/contact-us`} className="hover:text-gray-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
