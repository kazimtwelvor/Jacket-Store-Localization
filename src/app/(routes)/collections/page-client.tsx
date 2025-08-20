'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface CategoriesPageProps {
  categories: any[]
}

const CategoriesPage = ({ categories }: CategoriesPageProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState(categories)

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchTerm, categories])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Collections</h1>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {!categories || categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No collections available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later or contact support if this issue persists.</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="group">
                <Link href={`/collections/${category.slug}`}>
                  <div className="relative overflow-hidden bg-white shadow-md w-full h-[290px] sm:h-[320px] md:h-[400px] lg:h-[430px] xl:h-[460px]">
                    <Image
                      src={category.imageUrl || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 p-4 group">
                      <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <h3 className="text-white text-lg md:text-xl lg:text-2xl text-left transition-all duration-500" style={{ fontFamily: 'var(--font-averta-bold)' }}>
                          {category.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage