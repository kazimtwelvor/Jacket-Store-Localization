"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import SizeGuideCard from "./size-guide-card"

export default function InteractiveModel() {
  const [gender, setGender] = useState<"male" | "female">("female")
  const [bodyType, setBodyType] = useState<"slim" | "average" | "athletic" | "plus">("average")
  const [height, setHeight] = useState<"petite" | "average" | "tall">("average")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getModelImage = () => {
    return `/placeholder.svg?height=600&width=400&query=fashion model ${gender} ${bodyType} ${height}`
  }

  const bodyTypes = [
    { id: "slim", label: "Slim" },
    { id: "average", label: "Average" },
    { id: "athletic", label: "Athletic" },
    { id: "plus", label: "Plus Size" },
  ]

  const heights = [
    { id: "petite", label: "Petite (5'3\" and under)" },
    { id: "average", label: "Average (5'4\" - 5'8\")" },
    { id: "tall", label: "Tall (5'9\" and above)" },
  ]

  const getSizeRecommendation = () => {
    if (gender === "female") {
      if (bodyType === "slim") {
        return "XS or S depending on height"
      } else if (bodyType === "average") {
        return "S or M depending on height"
      } else if (bodyType === "athletic") {
        return "M or L depending on muscle mass"
      } else {
        return "L, XL, or XXL depending on measurements"
      }
    } else {
      if (bodyType === "slim") {
        return "S or M depending on height"
      } else if (bodyType === "average") {
        return "M or L depending on height"
      } else if (bodyType === "athletic") {
        return "L or XL depending on muscle mass"
      } else {
        return "XL, XXL, or 3XL depending on measurements"
      }
    }
  }

  const getFitRecommendation = () => {
    if (bodyType === "slim") {
      return "Regular or slim fit for a tailored look. Avoid oversized fits unless going for a specific style."
    } else if (bodyType === "average") {
      return "Regular fit works well for most items. Slim fit for a more tailored look, relaxed for comfort."
    } else if (bodyType === "athletic") {
      return "Regular or relaxed fit to accommodate broader shoulders and chest. Look for stretch fabrics."
    } else {
      return "Relaxed or oversized fit for comfort. Look for stretch fabrics and avoid overly slim cuts."
    }
  }

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-[#2b2b2b}">Interactive Size Finder</h2>
          <p className="text-[#666666] max-w-3xl">
            Customize a model to match your body type and get personalized size recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className=" rounded-lg border border-black shadow-sm shadow-[#2b2b2b]/50 overflow-hidden">
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#2b2b2b}">Customize Your Model</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Gender</label>
                      <div className="flex space-x-2">
                        <span className="px-4 py-2 rounded-md text-sm flex-1 bg-[#F6F6F6] text-black">Female</span>
                        <span className="px-4 py-2 rounded-md text-sm flex-1 bg-[#F6F6F6] hover:bg-[#F6F6F6]/80">
                          Male
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Body Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {bodyTypes.map((type) => (
                          <span
                            key={type.id}
                            className={`px-3 py-2 rounded-md text-sm ${
                              type.id === "average" ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80"
                            }`}
                          >
                            {type.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Height</label>
                      <div className="space-y-2">
                        {heights.map((h) => (
                          <span
                            key={h.id}
                            className={`px-3 py-2 rounded-md text-sm w-full text-left block ${
                              h.id === "average" ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80"
                            }`}
                          >
                            {h.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className=" rounded-lg border border-black shadow-sm shadow-[#2b2b2b]/50 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="relative h-80 md:h-96 bg-[#F6F6F6] rounded-t-lg overflow-hidden">
                  <img
                    src="https://www.fineystjackets.com/placeholder.svg?height=600&width=400&query=fashion%20model%20female%20average%20average"
                    alt="Model visualization"
                    width={400}
                    height={600}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4  rounded-b-lg flex-grow">
                  <h3 className="font-medium text-center text-black">Women's Average Body Type</h3>
                  <p className="text-xs text-center text-black">Average Height</p>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="sr-only">
              <div>
                <h3>Men's Slim Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>
              <div>
                <h3>Men's Average Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>
              <div>
                <h3>Men's Athletic Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>
              <div>
                <h3>Men's Plus Size Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>

              <div>
                <h3>Women's Slim Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>
              <div>
                <h3>Women's Athletic Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>
              <div>
                <h3>Women's Plus Size Body Type</h3>
                <p>Petite Height</p>
                <p>Average Height</p>
                <p>Tall Height</p>
              </div>
            </div>

            <div className=" rounded-lg border border-black shadow-sm shadow-[#2b2b2b]/50 overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-[#2b2b2b}">Your Personalized Recommendations</h3>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-black">Recommended Size:</h4>
                    <p className="text-2xl font-bold">S or M depending on height</p>
                    <p className="text-xs text-[#666666] mt-1">Based on your selected body type and height</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-black">Recommended Fit:</h4>
                    <p>
                      Regular fit works well for most items. Slim fit for a more tailored look, relaxed for comfort.
                    </p>
                  </div>

                  <div aria-hidden="true" className="sr-only">
                    <h4>Other Size Recommendations:</h4>
                    <p>XS or S depending on height</p>
                    <p>M or L depending on height</p>
                    <p>L or XL depending on muscle mass</p>
                    <p>XL, XXL, or 3XL depending on measurements</p>

                    <h4>Other Fit Recommendations:</h4>
                    <p>
                      Regular or slim fit for a tailored look. Avoid oversized fits unless going for a specific style.
                    </p>
                    <p>Regular or relaxed fit to accommodate broader shoulders and chest. Look for stretch fabrics.</p>
                    <p>Relaxed or oversized fit for comfort. Look for stretch fabrics and avoid overly slim cuts.</p>
                  </div>

                  <div className=" p-3 rounded-md mt-auto border border-[#F6F6F6]">
                    <p className="text-sm text-black">
                      <strong className="text-black">Note:</strong> These are general recommendations. For the most
                      accurate fit, always refer to the specific product's size chart and take your actual measurements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-black">
        Interactive Size Visualization
      </h2>
      <p className="text-[#666666] max-w-3xl mb-6">Visualize how different sizes look on different body types.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SizeGuideCard className="border-black ">
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Customize Your Model</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setGender("female")}
                        className={`px-4 py-2 rounded-md text-sm flex-1 ${
                          gender === "female" ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80"
                        }`}
                      >
                        Female
                      </button>
                      <button
                        onClick={() => setGender("male")}
                        className={`px-4 py-2 rounded-md text-sm flex-1 ${
                          gender === "male" ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80"
                        }`}
                      >
                        Male
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Body Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {bodyTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setBodyType(type.id as any)}
                          className={`px-3 py-2 rounded-md text-sm ${
                            bodyType === type.id ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <div className="space-y-2">
                      {heights.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => setHeight(h.id as any)}
                          className={`px-3 py-2 rounded-md text-sm w-full text-left ${
                            height === h.id ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80"
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SizeGuideCard>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SizeGuideCard className="border-black ">
            <div className="h-full flex flex-col">
              <div className="relative h-80 md:h-96 bg-[#F6F6F6] rounded-t-lg overflow-hidden">
                <Image
                  src={getModelImage() || "/placeholder.svg"}
                  alt="Model visualization"
                  width={400}
                  height={600}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              <div className="p-4  rounded-b-lg flex-grow">
                <h3 className="font-medium text-center text-[#2b2b2b}">
                  {gender === "female" ? "Women's" : "Men's"} {bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}{" "}
                  Body Type
                </h3>
                <p className="text-xs text-center text-[#666666]">
                  {height.charAt(0).toUpperCase() + height.slice(1)} Height
                </p>
              </div>
            </div>
          </SizeGuideCard>

          <SizeGuideCard className="border-black ">
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-black">Your Personalized Recommendations</h3>

              <div className="space-y-6 flex-grow">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-[#333333]">Recommended Size:</h4>
                  <p className="text-2xl font-bold">{getSizeRecommendation()}</p>
                  <p className="text-xs text-[#666666] mt-1">Based on your selected body type and height</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 text-[#333333]">Recommended Fit:</h4>
                  <p>{getFitRecommendation()}</p>
                </div>

                <div className="bg-[#F6F6F6] p-3 rounded-md mt-auto border border-black">
                  <p className="text-sm text-[#333333]">
                    <strong className="text-[#2b2b2b}">Note:</strong> These are general recommendations. For the most
                    accurate fit, always refer to the specific product's size chart and take your actual measurements.
                  </p>
                </div>
              </div>
            </div>
          </SizeGuideCard>
        </div>
      </div>
    </motion.div>
  )
}
