export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="mx-auto w-full px-0 sm:px-4 lg:px-6 py-6 sm:py-8 md:py-12">
          <div className="mb-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 lg:gap-5 xl:gap-6 gap-y-8 md:gap-y-4 lg:gap-y-5 xl:gap-y-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
  