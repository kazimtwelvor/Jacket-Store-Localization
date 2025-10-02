"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingBag, Truck, RotateCcw, CreditCard, HelpCircle } from "lucide-react"
import Container from "@/src/app/ui/container"
import FAQItem from "./components/faq-item"
import { faqData } from "./data/faq-data"
import FAQHero from "./components/faq-hero"
import FAQCategory from "./components/faq-category"
import { Input } from "@/src/app/ui/input"

export default function FAQsClient() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredFAQs = faqData.filter((category) => {
    if (activeCategory !== "all" && category.category !== activeCategory) {
      return false
    }

    if (searchQuery) {
      return category.items.some(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return true
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Always render the hero - now with proper spacing */}
      <FAQHero />

      {/* Content that changes based on JavaScript availability */}
      {!isMounted ? (
        <Container>
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex justify-center overflow-x-auto pb-2 mb-8">
              <div className="flex space-x-3 md:space-x-4">
                <div className="flex flex-col items-center justify-center px-4 py-3 rounded-lg min-w-[100px] bg-[#2b2b2b] text-white shadow-md">
                  <div className="mb-2">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">All FAQs</span>
                </div>
                {faqData.map((category) => {
                  // Map category to appropriate icon
                  let icon
                  switch (category.category) {
                    case "products":
                      icon = <ShoppingBag className="h-5 w-5" />
                      break
                    case "shipping":
                      icon = <Truck className="h-5 w-5" />
                      break
                    case "returns":
                      icon = <RotateCcw className="h-5 w-5" />
                      break
                    case "payment":
                      icon = <CreditCard className="h-5 w-5" />
                      break
                    default:
                      icon = <HelpCircle className="h-5 w-5" />
                  }

                  return (
                    <div
                      key={category.category}
                      className="flex flex-col items-center justify-center px-4 py-3 rounded-lg min-w-[100px] bg-white text-black-600 border border-black-200"
                    >
                      <div className="mb-2">{icon}</div>
                      <span className="text-sm font-medium">{category.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-8">
              {faqData.map((category) => (
                <div key={category.category} className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-black-800">{category.title}</h3>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={`${category.category}-${itemIndex}`}
                        className="border rounded-lg overflow-hidden border-black-100"
                      >
                        <div className="p-5 font-medium">
                          <h3 className="text-lg">{item.question}</h3>
                        </div>
                        <div className="p-5 pt-0 text-black-600 border-t border-black-100">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black h-4 w-4" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10 bg-background border-black-100 focus:border-black-200 focus:ring-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-center overflow-x-auto pb-2 mb-8">
              <div className="flex space-x-3 md:space-x-4">
                <FAQCategory
                  category="all"
                  label="All FAQs"
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                  icon={<HelpCircle className="h-5 w-5" />}
                />
                {faqData.map((category) => {
                  // Map category to appropriate icon
                  let icon
                  switch (category.category) {
                    case "products":
                      icon = <ShoppingBag className="h-5 w-5" />
                      break
                    case "shipping":
                      icon = <Truck className="h-5 w-5" />
                      break
                    case "returns":
                      icon = <RotateCcw className="h-5 w-5" />
                      break
                    case "payment":
                      icon = <CreditCard className="h-5 w-5" />
                      break
                    default:
                      icon = <HelpCircle className="h-5 w-5" />
                  }

                  return (
                    <FAQCategory
                      key={category.category}
                      category={category.category}
                      label={category.title}
                      active={activeCategory === category.category}
                      onClick={() => setActiveCategory(category.category)}
                      icon={icon}
                    />
                  )
                })}
              </div>
            </div>

            <div className="space-y-8">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-black-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                filteredFAQs.map((category) => (
                  <div key={category.category} className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-black-800">{category.title}</h3>
                    <div className="space-y-4">
                      {category.items
                        .filter((item) => {
                          if (!searchQuery) return true
                          return (
                            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                        })
                        .map((item, itemIndex) => (
                          <FAQItem
                            key={`${category.category}-${itemIndex}`}
                            question={item.question}
                            answer={item.answer}
                            delay={itemIndex * 0.1}
                          />
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Container>
      )}
    </div>
  )
}
