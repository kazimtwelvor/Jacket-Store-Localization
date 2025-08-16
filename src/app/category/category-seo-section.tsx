"use client"

import type React from "react"
import { ArrowRight, Tag, Truck, Award, ThumbsUp } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/types"
import HtmlRenderer from "../ui/html-renderer"
HtmlRenderer
interface CategorySEOSectionProps {
  category: Category
  categoryName: string
  categoryDescription?: string
}

const CategorySEOSection: React.FC<CategorySEOSectionProps> = ({
  category,
  categoryName,
  categoryDescription,
}) => {
  const categoryContent = category?.categoryContent

  // Helper function to decode Unicode HTML entities
  const decodeHtml = (html: string) => {
    return html.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
  }
  return (
    <section className="w-full bg-gradient-to-r from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Explore Our <span className="text-[#2b2b2b]">{categoryName}</span> Collection
            </h2>

            <HtmlRenderer
              content={categoryContent?.mainContent ? decodeHtml(categoryContent.mainContent) : `<p>Discover our premium collection of ${categoryName.toLowerCase()} designed with quality and style in mind.</p>`}
              className="prose-lg text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            />

            <details className="mt-8">
              <summary
                className="inline-flex items-center text-[#2b2b2b] font-medium hover:underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more about our {categoryName.toLowerCase()} <ArrowRight className="ml-2 h-4 w-4" />
              </summary>
              <HtmlRenderer
                content={categoryContent?.learnMoreContent ? decodeHtml(categoryContent.learnMoreContent) : `<p>Additional information about our ${categoryName.toLowerCase()} collection.</p>`}
                className="mt-4 text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
              />
            </details>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Why Choose Our {categoryName}</h3>

            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-[#2b2b2b]/10 p-2 rounded-full mr-4">
                  <Award className="h-5 w-5 text-[#2b2b2b]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Premium Quality</h4>
                  <p className="text-sm text-gray-600">Crafted with the finest materials for exceptional durability</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-[#2b2b2b]/10 p-2 rounded-full mr-4">
                  <Tag className="h-5 w-5 text-[#2b2b2b]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Competitive Pricing</h4>
                  <p className="text-sm text-gray-600">Exceptional value without compromising on quality</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-[#2b2b2b]/10 p-2 rounded-full mr-4">
                  <Truck className="h-5 w-5 text-[#2b2b2b]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Fast Shipping</h4>
                  <p className="text-sm text-gray-600">Quick delivery to your doorstep with care</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-[#2b2b2b]/10 p-2 rounded-full mr-4">
                  <ThumbsUp className="h-5 w-5 text-[#2b2b2b]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Customer Satisfaction</h4>
                  <p className="text-sm text-gray-600">Thousands of happy customers trust our products</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(categoryContent?.faqs && categoryContent.faqs.length > 0 ? categoryContent.faqs : [
              { question: "What sizes are available?", answer: `Our ${categoryName.toLowerCase()} collection is available in a range of sizes from XS to XXL, ensuring a perfect fit for everyone.` },
              { question: `How do I care for my ${categoryName.toLowerCase()}?`, answer: "We recommend following the care instructions on each product label for optimal longevity and to maintain the quality of your items." },
              { question: "What is your return policy?", answer: "We offer a 30-day return policy on all items. Products must be in original condition with tags attached for a full refund." },
              { question: "Do you ship internationally?", answer: "Yes, we ship to most countries worldwide. Shipping times and costs vary depending on location." }
            ]).map((faq: any, index: number) => (
              <div key={index}>
                <h4 className="font-medium text-lg text-gray-900 mb-2">{faq.question}</h4>
                <HtmlRenderer content={faq.answer} className="text-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {(categoryContent?.popularSearches && categoryContent.popularSearches.length > 0 ? categoryContent.popularSearches : [
              { term: `${categoryName} for men`, link: "#" },
              { term: `${categoryName} for women`, link: "#" },
              { term: `Premium ${categoryName}`, link: "#" },
              { term: `Affordable ${categoryName}`, link: "#" },
              { term: `Best ${categoryName} 2025`, link: "#" },
              { term: `${categoryName} trends`, link: "#" }
            ]).map((search: any, index: number) => (
              <Link
                key={index}
                href={search.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
              >
                {search.term}
              </Link>
            ))}
          </div>
        </div>

        {/* Related Blogs */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Related Blogs</h3>
          <div className="flex flex-wrap gap-2">
            {(categoryContent?.selectedBlogs && categoryContent.selectedBlogs.length > 0 ? categoryContent.selectedBlogs : [
              { blogTitle: `How to Style ${categoryName}`, blogSlug: "#" },
              { blogTitle: `${categoryName} Care Guide`, blogSlug: "#" },
              { blogTitle: `Latest ${categoryName} Trends`, blogSlug: "#" },
              { blogTitle: `Choosing the Right ${categoryName}`, blogSlug: "#" },
              { blogTitle: `${categoryName} Fashion Tips`, blogSlug: "#" },
              { blogTitle: `Best ${categoryName} Brands`, blogSlug: "#" }
            ]).map((blog: any, index: number) => (
              <Link
                key={index}
                href={`/blogs/${blog.blogSlug}`}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
              >
                {blog.blogTitle}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategorySEOSection
