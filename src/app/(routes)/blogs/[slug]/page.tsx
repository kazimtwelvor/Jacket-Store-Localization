import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowUp, ArrowLeft, ArrowRight } from "lucide-react"
import { getBlog } from "@/src/app/actions/get-blog"
import BlogHeroSection from "../../../components/blogs/blog-hero-section"
import BlogClientScripts from "../../../components/blogs/blog-client-scripts"

export const revalidate = 3600; // ISR: Revalidate every hour
export const dynamicParams = true; // Generate new pages on-demand

interface BlogData {
  id: string
  slug: string
  title: string
  isPublished: boolean
  content: {
    hero: {
      title: string
      author: string
      date: string
      category: string
      readTime: string
      bannerImage: string
    }
    metadata: {
      slug: string
      title: string
      subtitle: string
      isPublished: boolean
    }
    contentSection: {
      title: string
      text: string
      subtitleHeading: string
      subtitleText: string
      mainImage: string
      smallImageTop: string
      smallImageBottom: string
    }
    guideContent: {
      title: string
      steps: Array<{
        id: string
        title: string
        subtitle: string
        content: string[]
        image?: string
        images?: string[]
        isActive: boolean
        buttonText?: string
        buttonLink?: string
        cardTitles?: string[]
        cardDescriptions?: string[]
        imageLabels?: string[]
        metrics?: any
        timelineItems?: Array<{
          title: string
          description: string
        }>
      }>
      keyTakeaways: {
        title: string
        whatYouLearned: {
          title: string
          items: string[]
        }
        nextSteps: {
          title: string
          description: string
          items: string[]
        }
      }
    }
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const blogData = await getBlog(slug)

  if (!blogData || !blogData.content.metadata.isPublished) {
    notFound()
  }

  const { hero, contentSection, guideContent } = blogData.content

  const renderStepContent = (step: any) => {
    if (step.images && step.images.length > 0 && step.images.some((img: string) => img)) {
      if (step.cardTitles && step.cardDescriptions) {
        return (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {step.cardTitles.map((title: string, index: number) => (
              <div key={index} className="flex flex-col items-center text-center">
                {step.images[index] && (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                    <Image src={step.images[index].replace('\n', '')} alt={title} fill className="object-cover" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#0A2463] mb-2">{title}</h3>
                <p className="text-gray-700">{step.cardDescriptions[index]}</p>
              </div>
            ))}
          </section>
        )
      } else if (step.imageLabels) {
        return (
          <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {step.images.filter(Boolean).map((image: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                <Image src={image.replace('\n', '')} alt={step.imageLabels?.[index] || `Image ${index + 1}`} fill className="object-cover" />
                {step.imageLabels?.[index] && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                    {step.imageLabels[index]}
                  </div>
                )}
              </div>
            ))}
          </section>
        )
      } else {
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {step.images.filter(Boolean).map((image: string, index: number) => (
              <div key={index} className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                <Image src={image.replace('\n', '')} alt={`${step.title} - Image ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )
      }
    }

    if (step.metrics) {
      if (step.metrics.before && step.metrics.after) {
        return (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-lg border-t-4 border-red-500">
              <h3 className="text-lg font-bold text-red-700 mb-4">{step.cardTitles?.[0] || 'Before'}</h3>
              <ul className="space-y-2">
                {step.metrics.before.map((item: string, index: number) => (
                  <li key={index} className="text-red-600">• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-t-4 border-green-500">
              <h3 className="text-lg font-bold text-green-700 mb-4">{step.cardTitles?.[1] || 'After'}</h3>
              <ul className="space-y-2">
                {step.metrics.after.map((item: string, index: number) => (
                  <li key={index} className="text-green-600">• {item}</li>
                ))}
              </ul>
            </div>
          </section>
        )
      } else if (step.metrics.titles && step.metrics.values) {
        return (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {step.metrics.titles.map((title: string, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#0A2463] text-center">
                <h3 className="text-lg font-bold text-[#0A2463] mb-2">{title}</h3>
                <div className="text-3xl font-bold text-[#B01E23]">{step.metrics.values[index]}</div>
              </div>
            ))}
          </section>
        )
      }
    }

    if (step.timelineItems) {
      return (
        <section className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#0A2463] to-[#B01E23]"></div>
          {step.timelineItems.map((item: any, index: number) => (
            <div key={index} className="relative mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 0 ? "md:text-right" : "md:order-2 md:text-left"}>
                  <div className={`bg-white p-6 rounded-lg shadow-md border-t-4 border-[#0A2463] ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                    <h3 className="text-lg font-bold text-[#0A2463] mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
                <div className={`relative ${index % 2 === 0 ? "" : "md:order-1"}`}>
                  <div className="h-[200px] relative rounded-lg overflow-hidden shadow-md">
                    {step.images?.[index] ? (
                      <Image src={step.images[index].replace('\n', '')} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <div className="text-gray-400">Image placeholder</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0A2463] border-4 border-white"></div>
            </div>
          ))}
        </section>
      )
    }

    return (
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {step.image && (
          <div className="relative h-[300px] rounded-lg overflow-hidden shadow-md">
            <Image src={step.image.replace('\n', '')} alt={step.title} fill className="object-cover" />
          </div>
        )}
        <div className="space-y-4">
          {step.content.map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-700" dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
          {step.buttonText && (
            <button className="bg-[#B01E23] text-white px-6 py-2 rounded-lg hover:bg-[#8B1A1F] transition-colors">
              {step.buttonText}
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white min-h-screen pt-24">
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#B01E23] to-[#0A2463] w-0 z-[9999] transition-all duration-200" id="reading-progress-bar"></div>

      <button
        id="back-to-top"
        className="fixed bottom-8 right-8 bg-[#B01E23] text-white p-3 rounded-full shadow-lg z-50 opacity-0 invisible transition-all duration-300"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>

      <BlogHeroSection
        title={hero.title}
        author={hero.author}
        date={hero.date}
        image={hero.bannerImage.replace('\n', '')}
        category={hero.category}
        readTime={hero.readTime}
      />

      <main className="container mx-auto px-4 py-8">
        {contentSection && (
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-[#0A2463] mb-4">{contentSection.title}</h1>
            <p className="text-gray-700 mb-6">{contentSection.text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Image
                  src={contentSection.mainImage.replace('\n', '')}
                  alt={contentSection.title}
                  width={600}
                  height={400}
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <Image
                  src={contentSection.smallImageTop.replace('\n', '')}
                  alt="Content Image 1"
                  width={300}
                  height={200}
                  className="object-cover rounded-lg mb-4"
                />
                <Image
                  src={contentSection.smallImageBottom.replace('\n', '')}
                  alt="Content Image 2"
                  width={300}
                  height={200}
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0A2463] mt-8 mb-4">{contentSection.subtitleHeading}</h2>
            <p className="text-gray-700">{contentSection.subtitleText}</p>
          </div>
        )}

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-[#B01E23] rounded-full"></div>
            <h1 className="text-2xl font-bold text-[#0A2463]">{guideContent.title}</h1>
          </div>

          <div className="space-y-12">
            {guideContent.steps.filter((step: any) => step.isActive).map((step: any, index: number) => (
              <div key={step.id} className="animate-fade-in my-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1 h-8 bg-[#B01E23] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-[#0A2463]">{step.title}</h2>
                </div>

                {step.subtitle && (
                  <p className="text-gray-700 mb-10 max-w-3xl">{step.subtitle}</p>
                )}

                {renderStepContent(step)}
              </div>
            ))}
          </div>
        </section>

        <section className="animate-fade-in my-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-8 bg-[#B01E23] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#0A2463]">{guideContent.keyTakeaways.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#0A2463]">
              <h3 className="text-lg font-bold text-[#0A2463] mb-4">{guideContent.keyTakeaways.whatYouLearned.title}</h3>
              <ul className="space-y-2">
                {guideContent.keyTakeaways.whatYouLearned.items.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#B01E23]">
              <h3 className="text-lg font-bold text-[#0A2463] mb-4">{guideContent.keyTakeaways.nextSteps.title}</h3>
              <p className="text-gray-700 mb-4">{guideContent.keyTakeaways.nextSteps.description}</p>
              <ul className="space-y-2">
                {guideContent.keyTakeaways.nextSteps.items.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <BlogClientScripts />
    </section>
  )
}
