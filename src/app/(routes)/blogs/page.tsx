"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Check, Loader2, Search, X } from "lucide-react"
import Container from "@/src/app/ui/container"
import { Button } from "@/src/app/ui/button"
import { toast } from "@/src/app/hooks/use-toast"

const CATEGORIES = ["All", "Style Guides", "Fashion Trends", "Sustainability", "Care Tips", "Brand Spotlights"]

const ALL_BLOG_POSTS = [
  {
    id: "singleblogpage",
    title: "Premium Leather Jackets: The Ultimate Style Guide",
    excerpt:
      "Discover everything you need to know about leather jackets - from their rich history to styling tips for the modern fashion enthusiast.",
    category: "Style Guides",
    date: "April 18, 2025",
    readTime: "12 min read",
    image: "/images/leather-jacket-model.png",
    featured: true,
  },
  {
    id: "2",
    title: "5 Essential Leather Jacket Styles Every Wardrobe Needs",
    excerpt:
      "From classic bombers to modern racer jackets, explore the must-have leather jacket styles for every fashion enthusiast.",
    category: "Style Guides",
    date: "April 10, 2025",
    readTime: "8 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "3",
    title: "The Art of Leather Care: Maintaining Your Investment Pieces",
    excerpt: "Learn how to properly care for and maintain your leather garments to ensure they last for years to come.",
    category: "Care Tips",
    date: "April 5, 2025",
    readTime: "10 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "4",
    title: "Sustainable Leather: Innovations Changing the Fashion Industry",
    excerpt:
      "Explore the latest developments in sustainable leather production and ethical alternatives revolutionizing fashion.",
    category: "Sustainability",
    date: "March 28, 2025",
    readTime: "15 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "5",
    title: "Spring/Summer 2025: This Season's Hottest Leather Trends",
    excerpt:
      "Discover the latest leather fashion trends for the upcoming season and how to incorporate them into your wardrobe.",
    category: "Fashion Trends",
    date: "March 20, 2025",
    readTime: "9 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "6",
    title: "Behind the Scenes: How Premium Leather Jackets Are Made",
    excerpt:
      "Take a journey through the meticulous craftsmanship and attention to detail that goes into creating luxury leather garments.",
    category: "Brand Spotlights",
    date: "March 15, 2025",
    readTime: "14 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "7",
    title: "How to Style Leather Jackets for Every Season",
    excerpt:
      "Learn versatile styling tips to wear your favorite leather jacket year-round, from summer evenings to winter layering.",
    category: "Style Guides",
    date: "March 10, 2025",
    readTime: "7 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "8",
    title: "The History of Leather in Fashion: From Necessity to Luxury",
    excerpt:
      "Explore the fascinating evolution of leather garments throughout history and how they became iconic fashion statements.",
    category: "Brand Spotlights",
    date: "March 5, 2025",
    readTime: "16 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "9",
    title: "Vegan Alternatives to Leather: A Sustainable Fashion Guide",
    excerpt:
      "Discover the latest innovations in vegan leather alternatives that are changing the landscape of sustainable fashion.",
    category: "Sustainability",
    date: "February 28, 2025",
    readTime: "11 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "10",
    title: "Celebrity Leather Looks: Get Inspired by the Stars",
    excerpt:
      "Take style cues from celebrities who have mastered the art of incorporating leather into their signature looks.",
    category: "Fashion Trends",
    date: "February 20, 2025",
    readTime: "8 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "11",
    title: "Leather Accessories: Small Pieces with Big Impact",
    excerpt:
      "Explore how leather accessories can elevate your outfit and add a touch of sophistication to any ensemble.",
    category: "Style Guides",
    date: "February 15, 2025",
    readTime: "6 min read",
    image: "/images/leather-jacket-model.png",
  },
  {
    id: "12",
    title: "DIY Leather Repair: Extending the Life of Your Favorite Pieces",
    excerpt:
      "Learn simple techniques to repair minor damage and keep your leather garments looking their best for years to come.",
    category: "Care Tips",
    date: "February 10, 2025",
    readTime: "13 min read",
    image: "/images/leather-jacket-model.png",
  },
]

const POSTS_PER_PAGE = 6

const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const filteredPosts = ALL_BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const currentlyVisiblePosts = filteredPosts.slice(0, visiblePosts)

  const hasMorePosts = filteredPosts.length > visiblePosts

  const featuredPost = ALL_BLOG_POSTS.find((post) => post.featured)

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
            <p className="text-lg text-muted-foreground mb-8">
              Discover the latest trends, styling tips, and expert advice on premium fashion.
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
        <div className="py-8 border-b overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeCategory === category
                  ? "border-[#1b1b1b] text-[#2b2b2b]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </Container>
      {featuredPost && (
        <Container>
          <div className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-[300px] md:h-[400px] lg:h-full rounded-lg overflow-hidden shadow-md">
                <Image
                  src={
                    featuredPost.image ||
                    "/placeholder.svg?height=600&width=800&query=premium leather jacket fashion model" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#1b1b1b]/10 text-[#2b2b2b] text-xs font-medium px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                  <Link href={`/blogs/${featuredPost.id}`}>
                    <Button className="bg-[#2b2b2b] hover:bg-[#eaeaea]/90 text-white">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}

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
                <Link href={`/blogs/${post.id}`} key={post.id} className="group">
                  <div className="h-full flex flex-col border border-[#eaeaea] rounded-lg overflow-hidden transition-all hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          post.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(post.title)}`
                        }
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-[#eaeaea]/10 text-[#2b2b2b] text-xs font-medium px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-[#1b1b1b] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
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
                variant="outline"
                className="border-[#2b2b2b] text-[#2b2b2b] hover:bg-[#eaeaea]/10"
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#2b2b2b]">Stay Updated with Fashion Insights</h2>
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

export default BlogsPage
