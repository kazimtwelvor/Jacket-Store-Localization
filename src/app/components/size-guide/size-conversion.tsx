"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSizeGuideContext } from "./size-guide-context"
import SizeGuideTable from "./size-guide-table"

export default function SizeConversion() {
  const [isMounted, setIsMounted] = useState(false)
  const [category, setCategory] = useState("clothing")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const categories = [
    { id: "clothing", label: "Clothing" },
    { id: "shoes", label: "Shoes" },
    { id: "accessories", label: "Accessories" },
  ]

  const clothingSizeConversion = [
    { us: "XS", uk: "6", eu: "34", international: "XXS" },
    { us: "S", uk: "8", eu: "36", international: "XS" },
    { us: "M", uk: "10", eu: "38", international: "S" },
    { us: "L", uk: "12", eu: "40", international: "M" },
    { us: "XL", uk: "14", eu: "42", international: "L" },
    { us: "XXL", uk: "16", eu: "44", international: "XL" },
  ]

  const shoesSizeConversion = [
    { us: "5", uk: "3", eu: "35", cm: "22" },
    { us: "6", uk: "4", eu: "36", cm: "23" },
    { us: "7", uk: "5", eu: "37", cm: "24" },
    { us: "8", uk: "6", eu: "38", cm: "25" },
    { us: "9", uk: "7", eu: "39", cm: "26" },
    { us: "10", uk: "8", eu: "40", cm: "27" },
    { us: "11", uk: "9", eu: "41", cm: "28" },
  ]

  const accessoriesSizeConversion = [
    { type: "Hats", us: "S", uk: "6 3/4", eu: "54", cm: "54-55" },
    { type: "Hats", us: "M", uk: "7", eu: "56", cm: "56-57" },
    { type: "Hats", us: "L", uk: "7 1/4", eu: "58", cm: "58-59" },
    { type: "Gloves", us: "S", uk: "7", eu: "7", cm: "18" },
    { type: "Gloves", us: "M", uk: "8", eu: "8", cm: "20" },
    { type: "Gloves", us: "L", uk: "9", eu: "9", cm: "23" },
  ]

  const renderTable = (currentCategory: string) => {
    switch (currentCategory) {
      case "clothing":
        return (
          <SizeGuideTable
            headers={["US", "UK", "EU", "International"]}
            data={clothingSizeConversion.map((size) => [size.us, size.uk, size.eu, size.international])}
          />
        )
      case "shoes":
        return (
          <SizeGuideTable
            headers={["US", "UK", "EU", "CM"]}
            data={shoesSizeConversion.map((size) => [size.us, size.uk, size.eu, size.cm])}
          />
        )
      case "accessories":
        return (
          <SizeGuideTable
            headers={["Type", "US", "UK", "EU", "CM"]}
            data={accessoriesSizeConversion.map((size) => [size.type, size.us, size.uk, size.eu, size.cm])}
          />
        )
      default:
        return null
    }
  }

  if (!isMounted) {
    return (
      <section className="space-y-8">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Size Conversion</h2>
          <p className="text-muted-foreground max-w-3xl">
            Convert between different international sizing systems to find your perfect fit.
          </p>
        </section>

        <section className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                cat.id === "clothing" ? "bg-[#eaeaea] text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </section>

        <section className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  US
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  UK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  EU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  International
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {clothingSizeConversion.map((size, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{size.us}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{size.uk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{size.eu}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{size.international}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-muted/20 rounded-lg border p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Size Conversion Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-muted-foreground">
                Sizes can vary between brands, so always check the specific brand's size chart when available.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-muted-foreground">
                When in doubt, go with your measurements rather than your usual size.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-muted-foreground">
                European sizes tend to run smaller than US sizes, so you may need to size up.
              </span>
            </li>
          </ul>
        </section>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-[#2b2b2b]">Size Conversion</h2>
      <p className="text-black max-w-3xl mb-6">
        Convert between different international sizing systems to find your perfect fit.
      </p>

      <section className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              category === cat.id ? "bg-[#eaeaea] text-black" : "bg-[#eaeaea] hover:bg-[#eaeaea]/80 text-black"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      <section className="bg-white rounded-lg border border-[#2b2b2b] shadow-sm overflow-hidden">
        {renderTable(category)}
      </section>

      <section className="bg-white rounded-lg border border-[2b2b2b] p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-">Size Conversion Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-[#2b2b2b] mr-2">•</span>
            <span className="text-black">
              Sizes can vary between brands, so always check the specific brand's size chart when available.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-[#2b2b2b] mr-2">•</span>
            <span className="text-black">
              When in doubt, go with your measurements rather than your usual size.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-[#2b2b2b] mr-2">•</span>
            <span className="text-black">
              European sizes tend to run smaller than US sizes, so you may need to size up.
            </span>
          </li>
        </ul>
      </section>
    </motion.section>
  )
}
