import Container from "@/src/app/ui/container"
import getProducts from "@/src/app/actions/get-products"
import ProductShowcaseSection from "@/src/app/ui/product-showcase-section"

export const revalidate = 0

async function ShowcasePage() {
  try {
    const productsData = await getProducts({ isFeatured: true })
    const products = productsData.products || []

    return (
      <div className="flex flex-col w-full overflow-hidden">
        {/* Product Showcase Section 1 */}
        <ProductShowcaseSection
          title="New Arrivals"
          products={products.slice(0, 4)}
          backgroundColor="#f9f9f9"
          textColor="#333"
        />

        {/* Product Showcase Section 2 */}
        <ProductShowcaseSection
          title="Best Sellers"
          products={products.slice(4, 8)}
          backgroundColor="#e8f0f7"
          textColor="#333"
        />

        {/* Product Showcase Section 3 */}
        <ProductShowcaseSection
          title="Trending Now"
          products={products.slice(8, 12)}
          backgroundColor="#f0f0f0"
          textColor="#333"
        />

        {/* Product Showcase Section 4 */}
        <ProductShowcaseSection
          title="Limited Edition"
          products={products.slice(12, 16)}
          backgroundColor="#f5f5f5"
          textColor="#333"
        />

        {/* Product Showcase Section 5 */}
        <ProductShowcaseSection
          title="Summer Collection"
          products={products.slice(0, 4)}
          backgroundColor="#f9f9f9"
          textColor="#333"
        />

        {/* Product Showcase Section 6 */}
        <ProductShowcaseSection
          title="Winter Collection"
          products={products.slice(4, 8)}
          backgroundColor="#e8f0f7"
          textColor="#333"
        />

        {/* Product Showcase Section 7 */}
        <ProductShowcaseSection
          title="Spring Collection"
          products={products.slice(8, 12)}
          backgroundColor="#f0f0f0"
          textColor="#333"
        />

        {/* Product Showcase Section 8 */}
        <ProductShowcaseSection
          title="Autumn Collection"
          products={products.slice(12, 16)}
          backgroundColor="#f5f5f5"
          textColor="#333"
        />

        {/* Product Showcase Section 9 */}
        <ProductShowcaseSection
          title="Men's Collection"
          products={products.slice(0, 4)}
          backgroundColor="#f9f9f9"
          textColor="#333"
        />

        {/* Product Showcase Section 10 */}
        <ProductShowcaseSection
          title="Women's Collection"
          products={products.slice(4, 8)}
          backgroundColor="#e8f0f7"
          textColor="#333"
        />

        {/* Product Showcase Section 11 */}
        <ProductShowcaseSection
          title="Kids Collection"
          products={products.slice(8, 12)}
          backgroundColor="#f0f0f0"
          textColor="#333"
        />

        {/* Product Showcase Section 12 */}
        <ProductShowcaseSection
          title="Leather Collection"
          products={products.slice(12, 16)}
          backgroundColor="#f5f5f5"
          textColor="#333"
        />

        {/* Product Showcase Section 13 */}
        <ProductShowcaseSection
          title="Denim Collection"
          products={products.slice(0, 4)}
          backgroundColor="#f9f9f9"
          textColor="#333"
        />

        {/* Product Showcase Section 14 */}
        <ProductShowcaseSection
          title="Suit Collection"
          products={products.slice(4, 8)}
          backgroundColor="#e8f0f7"
          textColor="#333"
        />

        {/* Product Showcase Section 15 */}
        <ProductShowcaseSection
          title="T-Shirt Collection"
          products={products.slice(8, 12)}
          backgroundColor="#f0f0f0"
          textColor="#333"
        />

        {/* Product Showcase Section 16 */}
        <ProductShowcaseSection
          title="Shoes Collection"
          products={products.slice(12, 16)}
          backgroundColor="#f5f5f5"
          textColor="#333"
        />

        {/* Product Showcase Section 17 */}
        <ProductShowcaseSection
          title="Accessories Collection"
          products={products.slice(0, 4)}
          backgroundColor="#f9f9f9"
          textColor="#333"
        />

        {/* Product Showcase Section 18 */}
        <ProductShowcaseSection
          title="Bags Collection"
          products={products.slice(4, 8)}
          backgroundColor="#e8f0f7"
          textColor="#333"
        />

        {/* Product Showcase Section 19 */}
        <ProductShowcaseSection
          title="Hats Collection"
          products={products.slice(8, 12)}
          backgroundColor="#f0f0f0"
          textColor="#333"
        />

        {/* Product Showcase Section 20 */}
        <ProductShowcaseSection
          title="Belts Collection"
          products={products.slice(12, 16)}
          backgroundColor="#f5f5f5"
          textColor="#333"
        />
      </div>
    )
  } catch (error) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-500">We're having trouble loading the store data. Please try again later.</p>
        </div>
      </Container>
    )
  }
}

export default ShowcasePage
