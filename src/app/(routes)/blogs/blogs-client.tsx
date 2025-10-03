"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Check, Loader2, Search, X } from "lucide-react"
import Container from "@/src/app/ui/container"
import { Button } from "@/src/app/ui/button"
import { toast } from "@/src/app/hooks/use-toast"


const POSTS_PER_PAGE = 6

interface BlogsClientProps {
  initialBlogs: any[]
}

const BlogsClient = ({ initialBlogs }: BlogsClientProps) => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const filteredPosts = initialBlogs.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const currentlyVisiblePosts = filteredPosts.slice(0, visiblePosts)

  const hasMorePosts = filteredPosts.length > visiblePosts

  const featuredPost = initialBlogs.find((post) => post.featured)

  const handleLoadMore = async () => {
    setIsLoadingMore(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    setVisiblePosts((prev) => prev + POSTS_PER_PAGE)
    setIsLoadingMore(false)

    const postsContainer = document.getElementById("posts-container")
    if (postsContainer) {
      const lastCurrentPost = postsContainer.children[postsContainer.children.length - POSTS_PER_PAGE]
      if (lastCurrentPost) {
        lastCurrentPost.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setVisiblePosts(POSTS_PER_PAGE)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVisiblePosts(POSTS_PER_PAGE)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubscriptionStatus("success")
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      })

      setEmail("")

      setTimeout(() => {
        setSubscriptionStatus("idle")
      }, 5000)
    } catch (error) {
      setSubscriptionStatus("error")
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="bg-[#eaeaea] py-16 md:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#2b2b2b]">Fashion Insights & Style Guide</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Welcome to our comprehensive fashion blog, where style meets substance and luxury meets accessibility. Discover the latest trends, expert styling tips, and insider knowledge about premium fashion and outerwear.
            </p>
            <p className="text-base text-muted-foreground mb-6">
              Our curated collection of articles covers everything from seasonal fashion trends to timeless wardrobe essentials. Whether you're looking for guidance on choosing the perfect leather jacket, understanding fabric quality, or mastering the art of layering, our expert team provides valuable insights to elevate your personal style.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              From runway inspirations to street style photography, we bring you the most relevant fashion content. Our blog features detailed product guides, styling tutorials, care instructions for luxury garments, and exclusive behind-the-scenes content from the fashion industry. Stay informed about emerging designers, sustainable fashion practices, and the latest innovations in outerwear technology. Join our community of fashion enthusiasts and discover how to build a wardrobe that reflects your unique personality while maintaining the highest standards of quality and craftsmanship.
            </p>
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-full border bg-white border-gray-200 focus:ring-2 focus:ring-[#2b2b2b] focus:border-[#2b2b2b] transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </Container>
      </div>

   

      <Container>
        <div className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-[#2b2b2b]">Latest Articles</h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 border-[#2b2b2b] text-[#1b1b1b] hover:bg-[#2b2b2b]"
                onClick={() => {
                  handleCategoryChange("All")
                  setSearchQuery("")
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div id="posts-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentlyVisiblePosts.map((post) => (
                <Link href={`/us/blogs/${post.slug || post.id}`} key={post.id} className="group">
                  <div className="h-full flex flex-col border border-[#eaeaea] rounded-lg overflow-hidden transition-all hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          post.imageUrl || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(post.title || 'blog post')}`
                        }
                        alt={post.title || 'Blog post'}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-[#eaeaea]/10 text-[#2b2b2b] text-xs font-medium px-2 py-1 rounded-full">
                          {post.category || 'Article'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-[#1b1b1b] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {post.excerpt || post.content?.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">5 min read</span>
                        <span className="text-sm font-medium text-[#2b2b2b] flex items-center">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMorePosts && (
            <div className="mt-12 text-center">
              <Button
                variant="blackInvert"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Articles"
                )}
              </Button>
            </div>
          )}
        </div>
      </Container>

      <div className="bg-[#eaeaea] py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#2b2b2b]">Stay Updated with Fashion Insights</h3>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to receive the latest articles, style guides, and exclusive offers directly to
              your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className={`w-full bg-white px-4 py-3 rounded-md border ${subscriptionStatus === "error" ? "border-black" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#2b2b2b]/50`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {subscriptionStatus === "success" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
                {subscriptionStatus === "error" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <X className="h-5 w-5 text-black" />
                  </div>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-[#2b2b2b] hover:bg-[#1b1b1b] text-white">
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {subscriptionStatus === "success" && (
              <p className="text-green-600 mt-3 text-sm">
                Thank you for subscribing! You'll receive our next newsletter soon.
              </p>
            )}
          </div>
        </Container>
      </div>
    </section>
  )
}

export default BlogsClient