# URL Redirect Test

## Test the following URLs to ensure they redirect properly:

### Root and Main Pages
- `/` → `/us/` (301 redirect)
- `/shop` → `/us/shop` (301 redirect)
- `/blogs` → `/us/blogs` (301 redirect)

### Policy Pages
- `/shipping-and-delivery-policy` → `/us/shipping-and-delivery-policy` (301 redirect)
- `/privacy-policy` → `/us/privacy-policy` (301 redirect)
- `/terms-conditions` → `/us/terms-conditions` (301 redirect)

### Shop with Query Parameters
- `/shop?genders=male` → `/us/shop?genders=male` (301 redirect)
- `/shop?genders=female` → `/us/shop?genders=female` (301 redirect)
- `/shop?materials=Leather` → `/us/shop?materials=Leather` (301 redirect)

### Other Pages
- `/about-us` → `/us/about-us` (301 redirect)
- `/contact-us` → `/us/contact-us` (301 redirect)
- `/faqs` → `/us/faqs` (301 redirect)
- `/reviews` → `/us/reviews` (301 redirect)
- `/size-guide` → `/us/size-guide` (301 redirect)

## How to Test

1. Start your development server: `npm run dev`
2. Visit each URL above in your browser
3. Verify that:
   - The URL redirects to the `/us/` version
   - The redirect is a 301 (permanent redirect)
   - Query parameters are preserved
   - The page loads correctly

## Expected Behavior

All URLs without the `/us/` prefix should automatically redirect to their `/us/` equivalent with a 301 status code. This eliminates redirect chains and improves SEO performance.

## Implementation Details

- Redirects are configured in `next.config.ts` using the `redirects()` function
- All redirects use `permanent: true` for 301 status codes
- Query parameters are preserved using the `:path*` syntax
- The middleware handles CORS for API routes only