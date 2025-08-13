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
      <section className="absolute inset-0">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <section className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></section>
      </section>

      <section className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <section className="max-w-3xl">
          <span className="inline-block bg-[#FF6C1A] text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
            {category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>

          <section className="flex flex-wrap items-center gap-4 text-white/90">
            <section className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{date}</span>
            </section>
            <section className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">{readTime}</span>
            </section>
            <section className="flex items-center">
              <span className="text-sm">By {author}</span>
            </section>
          </section>
        </section>
      </section>
    </section>
  )
}

export default BlogHeroSection
