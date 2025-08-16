import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

interface BlogHeroSectionProps {
  title: string
  author: string
  date: string
  image: string
  category: string
  readTime: string
}

const BlogHeroSection = ({ title, author, date, image, category, readTime }: BlogHeroSectionProps) => {
  return (
    <section className="relative h-[400px] md:h-[500px] w-full">
      <div className="absolute inset-0">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      </div>

      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-3xl">
          <span className="inline-block bg-[#FF6C1A] text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
            {category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">{readTime}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">By {author}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogHeroSection
