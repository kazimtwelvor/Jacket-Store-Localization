import Link from "next/link"

export default function SizeGuideCTA() {
  return (
    <div className="bg-gradient-to-r from-[#2b2b2b]/10 via-white to-[#2b2b2b]/5 py-16">
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#2b2b2b] mb-4">Ready to Find Your Perfect Fit?</h2>
        <p className="text-lg text-[#666666] mb-8">
          Now that you know your size, explore our collection and shop with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop?genders=female"
            className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2b2b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#2b2b2b] text-white hover:bg-[#2b2b2b]/90 h-11 px-8 py-2"
          >
            Shop Women's Collection
          </Link>
          <Link
            href="/shop?genders=male"
            className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2b2b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#2b2b2b] bg-white hover:bg-[#2b2b2b] text-[#333333] h-11 px-8 py-2"

          >
            Shop Men's Collection
          </Link>
        </div>
      </div>
    </div>
  )
}
