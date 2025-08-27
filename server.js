const { createServer } = require("http")
const { parse, format } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3019

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)

    const pathname = parsedUrl.pathname || "/"

    // 1) Allow API and assets to pass through untouched
    const isApi = pathname.startsWith("/api")
    const isAsset =
      pathname.startsWith("/_next") ||
      pathname.startsWith("/static") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/uploads") ||
      pathname === "/favicon.ico" ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      /\.[a-zA-Z0-9]{2,8}$/.test(pathname)

    if (!isApi && !isAsset) {
      // 2) Redirect non-prefixed URLs to /us prefix
      if (pathname === "/") {
        res.statusCode = 302
        res.setHeader("Location", "/us")
        res.end()
        return
      }
      if (!pathname.startsWith("/us")) {
        const location = format({
          pathname: `/us${pathname}`,
          query: parsedUrl.query,
        })
        res.statusCode = 302
        res.setHeader("Location", location)
        res.end()
        return
      }

      // 3) Internally rewrite /us/* to underlying route before handing to Next
      if (pathname === "/us") {
        parsedUrl.pathname = "/"
      } else if (pathname.startsWith("/us/")) {
        parsedUrl.pathname = pathname.replace(/^\/us/, "") || "/"
      }
    }

    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

