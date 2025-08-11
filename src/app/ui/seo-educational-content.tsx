"use client"
import { motion } from "framer-motion"
import { Rocket, Search, FileText, Cpu, BarChart2, CheckCircle2 } from "lucide-react"

// Schema.org JSON-LD markup for SEO
const SEOContentSchema = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "SEO Optimization Guide",
          description:
            "Comprehensive guide to SEO optimization including on-page, off-page, and technical SEO strategies.",
          keywords: [
            "SEO optimization",
            "on-page SEO",
            "off-page SEO",
            "technical SEO",
            "content optimization",
            "search engine ranking",
          ],
          author: {
            "@type": "Organization",
            name: "Your Store Name",
          },
          publisher: {
            "@type": "Organization",
            name: "Your Store Name",
            logo: {
              "@type": "ImageObject",
              url: "https://yourstore.com/logo.png",
            },
          },
          datePublished: new Date().toISOString(),
          dateModified: new Date().toISOString(),
        }),
      }}
    />
  )
}

const SEOEducationalContent = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <SEOContentSchema />

      {/* Main Heading Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
          User-friendly solution to generate content.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          With just a few minutes, you can create unique, highly converting content that will help you succeed in your
          marketing business.
        </p>
      </div>

      {/* Three Column Feature Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {/* Column 1 */}
        <motion.div
          className="bg-gray-50 p-8 rounded-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-red-500 mb-4">
            <FileText size={36} />
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Generate original, high-quality long-form content</h2>
          <p className="text-gray-600 mb-4">
            Create long-form content: product roundups, product reviews, and how-to guides. Just enter a brief and let
            the AI do the magic!
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Comprehensive product descriptions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>SEO-optimized blog articles</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Detailed how-to guides</span>
            </li>
          </ul>
        </motion.div>

        {/* Column 2 */}
        <motion.div
          className="bg-gray-50 p-8 rounded-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-red-500 mb-4">
            <Rocket size={36} />
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Create detailed product listings 10X faster</h2>
          <p className="text-gray-600 mb-4">
            Just enter the URLs of the products you want to list on your article, and with a few clicks you can have a
            complete, informative listing.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Automated product data extraction</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Customizable listing templates</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Bulk product processing</span>
            </li>
          </ul>
        </motion.div>

        {/* Column 3 */}
        <motion.div
          className="bg-gray-50 p-8 rounded-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-red-500 mb-4">
            <Search size={36} />
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Optimize content for SEO to rank in search results</h2>
          <p className="text-gray-600 mb-4">
            Get your content to rank for valuable keywords with our Checker. It'll guide you on how to optimize your
            article for the top of search results.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Keyword density analysis</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Readability scoring</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Meta tag optimization</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* SEO Matrix Section */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
          The Search Engine Optimization Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 border border-gray-200 rounded-lg overflow-hidden">
          {/* Content Quadrant */}
          <motion.div
            className="bg-amber-100 p-6 md:p-8"
            whileHover={{ backgroundColor: "#fef3c7" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900 uppercase tracking-wide">Content</h3>
            <p className="text-gray-700">
              Content refers to the quality and quantity of content on a website, such as blog posts, articles, and
              videos.
            </p>
          </motion.div>

          {/* Technical Quadrant */}
          <motion.div
            className="bg-amber-100 p-6 md:p-8"
            whileHover={{ backgroundColor: "#fef3c7" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900 uppercase tracking-wide">Technical</h3>
            <p className="text-gray-700">
              Technical SEO focuses on the technical aspects of a website, such as page speed, indexing, and
              crawlability.
            </p>
          </motion.div>

          {/* On-Page Quadrant */}
          <motion.div
            className="bg-amber-100 p-6 md:p-8"
            whileHover={{ backgroundColor: "#fef3c7" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900 uppercase tracking-wide">On-Page</h3>
            <p className="text-gray-700">
              On-Page SEO refers to the optimization of individual webpages, such as meta tags, titles, and
              descriptions.
            </p>
          </motion.div>

          {/* Off-Page Quadrant */}
          <motion.div
            className="bg-amber-100 p-6 md:p-8"
            whileHover={{ backgroundColor: "#fef3c7" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900 uppercase tracking-wide">Off-Page</h3>
            <p className="text-gray-700">
              Off-Page SEO refers to activities outside of the website, such as link building and social media.
            </p>
          </motion.div>
        </div>
      </div>

      {/* SEO Types Comparison */}
      <div className="max-w-6xl mx-auto mb-20 bg-amber-100 rounded-lg p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">The Difference between:</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* On-Page SEO */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white bg-amber-500 py-2 px-4 rounded-md inline-block">
              On-Page SEO
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Site content</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Title tag & meta tag optimization</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>H tag optimization</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Internal linking</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Image optimization</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>& more</span>
              </li>
            </ul>
          </motion.div>

          {/* OFF-Page SEO */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white bg-red-500 py-2 px-4 rounded-md inline-block">
              OFF-Page SEO
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Link building</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Content marketing</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Social media</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Podcasts</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Reviews</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>& more</span>
              </li>
            </ul>
          </motion.div>

          {/* Technical SEO */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white bg-red-800 py-2 px-4 rounded-md inline-block">
              Technical SEO
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Site speed</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Structured data</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Canonicalization</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>XML Sitemap</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Hreflang</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>& more</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* On-Page vs Off-Page SEO Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {/* Off-Page SEO Column */}
          <motion.div
            className="bg-gray-100 p-6 md:p-8 relative"
            whileHover={{ backgroundColor: "#f3f4f6" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">Off-Page SEO Activities</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Social bookmarking</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Creating Shareable Content</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Web 2.0 Submission</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Article Submission</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Video Submission</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Image Submission</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Document Sharing</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Blog Directory Submission</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                <span>Info-graphics Submission</span>
              </li>
            </ul>

            {/* SEO Circle Overlay - Only visible on desktop */}
            <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-lg">SEO</div>
                  <div className="text-xs">
                    <span className="text-red-500">ON</span>
                    <span className="text-blue-500">PAGE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* On-Page SEO Column */}
          <motion.div
            className="bg-amber-100 p-6 md:p-8"
            whileHover={{ backgroundColor: "#fef3c7" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">On-Page SEO Elements</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Page Titles & Heading Tags</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Meta Descriptions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Keyword research</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Image Optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Internal Linking & URL</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Use Responsive Design</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Boost Site Speed</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Use Social Sharing Button</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 font-medium">Create a sitemap</span>
              </li>
            </ul>
          </motion.div>

          {/* SEO Circle for Mobile */}
          <div className="block md:hidden mx-auto my-4">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-blue-600 font-bold text-lg">SEO</div>
                <div className="text-xs">
                  <span className="text-red-500">ON</span>
                  <span className="text-blue-500">PAGE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Resources Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Learn More About SEO</h2>
        <p className="text-gray-600 mb-8">
          Explore our comprehensive resources to master search engine optimization and improve your website's
          visibility.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="/seo-guide"
            className="inline-flex items-center px-6 py-3 bg-[#2b2b2b] text-white rounded-lg"
            whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="mr-2 h-5 w-5" />
            Complete SEO Guide
          </motion.a>

          <motion.a
            href="/seo-tools"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg"
            whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
            whileTap={{ scale: 0.95 }}
          >
            <Cpu className="mr-2 h-5 w-5" />
            SEO Tools
          </motion.a>

          <motion.a
            href="/seo-audit"
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg"
            whileHover={{ scale: 1.05, backgroundColor: "#f59e0b" }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            Free SEO Audit
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default SEOEducationalContent
