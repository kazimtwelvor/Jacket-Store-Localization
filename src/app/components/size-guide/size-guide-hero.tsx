export default function SizeGuideHero() {
  return (
    <div className="relative bg-gradient-to-r from-[#2b2b2b]/10 via-white to-[#2b2b2b]/5 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2b2b2b] mb-4">Size Guide</h1>
          <p className="text-lg md:text-xl text-[#666666] max-w-3xl mx-auto">
            Find your perfect fit with our comprehensive size guide. We've made it easy to determine your ideal size for
            all our products.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  )
}
