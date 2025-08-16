"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSizeGuideContext } from "./size-guide-context"
import SizeGuideTable from "./size-guide-table"

export default function SizeChart() {
  const { unit, setUnit } = useSizeGuideContext()
  const [category, setCategory] = useState("mens")
  const [isMounted, setIsMounted] = useState(false)

  const [, forceUpdate] = useState({})

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    forceUpdate({})
  }, [unit])

  const categories = [
    { id: "mens", label: "Men's Clothing" },
    { id: "womens", label: "Women's Clothing" },
    { id: "kids", label: "Kids' Clothing" },
    { id: "shoes", label: "Footwear" },
    { id: "accessories", label: "Accessories" },
  ]

  const mensClothingSizes = [
    {
      size: "XS",
      chest: unit === "in" ? "34-36" : "86-91",
      waist: unit === "in" ? "28-30" : "71-76",
      hips: unit === "in" ? "34-36" : "86-91",
    },
    {
      size: "S",
      chest: unit === "in" ? "36-38" : "91-97",
      waist: unit === "in" ? "30-32" : "76-81",
      hips: unit === "in" ? "36-38" : "91-97",
    },
    {
      size: "M",
      chest: unit === "in" ? "38-40" : "97-102",
      waist: unit === "in" ? "32-34" : "81-86",
      hips: unit === "in" ? "38-40" : "97-102",
    },
    {
      size: "L",
      chest: unit === "in" ? "40-42" : "102-107",
      waist: unit === "in" ? "34-36" : "86-91",
      hips: unit === "in" ? "40-42" : "102-107",
    },
    {
      size: "XL",
      chest: unit === "in" ? "42-44" : "107-112",
      waist: unit === "in" ? "36-38" : "91-97",
      hips: unit === "in" ? "42-44" : "107-112",
    },
    {
      size: "XXL",
      chest: unit === "in" ? "44-46" : "112-117",
      waist: unit === "in" ? "38-40" : "97-102",
      hips: unit === "in" ? "44-46" : "112-117",
    },
  ]

  const womensClothingSizes = [
    {
      size: "XS",
      bust: unit === "in" ? "32-33" : "81-84",
      waist: unit === "in" ? "24-25" : "61-64",
      hips: unit === "in" ? "34-35" : "86-89",
    },
    {
      size: "S",
      bust: unit === "in" ? "34-35" : "86-89",
      waist: unit === "in" ? "26-27" : "66-69",
      hips: unit === "in" ? "36-37" : "91-94",
    },
    {
      size: "M",
      bust: unit === "in" ? "36-37" : "91-94",
      waist: unit === "in" ? "28-29" : "71-74",
      hips: unit === "in" ? "38-39" : "97-99",
    },
    {
      size: "L",
      bust: unit === "in" ? "38-40" : "97-102",
      waist: unit === "in" ? "30-32" : "76-81",
      hips: unit === "in" ? "40-42" : "102-107",
    },
    {
      size: "XL",
      bust: unit === "in" ? "41-43" : "104-109",
      waist: unit === "in" ? "33-35" : "84-89",
      hips: unit === "in" ? "43-45" : "109-114",
    },
    {
      size: "XXL",
      bust: unit === "in" ? "44-46" : "112-117",
      waist: unit === "in" ? "36-38" : "91-97",
      hips: unit === "in" ? "46-48" : "117-122",
    },
  ]

  const kidsClothingSizes = [
    {
      size: "2T",
      height: unit === "in" ? "33-35" : "84-89",
      weight: unit === "in" ? "28-32 lbs" : "13-15 kg",
      chest: unit === "in" ? "21" : "53",
    },
    {
      size: "3T",
      height: unit === "in" ? "35-38" : "89-97",
      weight: unit === "in" ? "32-35 lbs" : "15-16 kg",
      chest: unit === "in" ? "22" : "56",
    },
    {
      size: "4T",
      height: unit === "in" ? "38-41" : "97-104",
      weight: unit === "in" ? "35-39 lbs" : "16-18 kg",
      chest: unit === "in" ? "23" : "58",
    },
    {
      size: "5",
      height: unit === "in" ? "41-44" : "104-112",
      weight: unit === "in" ? "39-45 lbs" : "18-20 kg",
      chest: unit === "in" ? "24" : "61",
    },
    {
      size: "6",
      height: unit === "in" ? "44-47" : "112-119",
      weight: unit === "in" ? "45-50 lbs" : "20-23 kg",
      chest: unit === "in" ? "25" : "64",
    },
    {
      size: "7",
      height: unit === "in" ? "47-50" : "119-127",
      weight: unit === "in" ? "50-59 lbs" : "23-27 kg",
      chest: unit === "in" ? "26" : "66",
    },
  ]

  const footwearSizes = [
    { us: "6", uk: "5", eu: "39", jp: "24", cm: "23.5" },
    { us: "7", uk: "6", eu: "40", jp: "25", cm: "24.5" },
    { us: "8", uk: "7", eu: "41", jp: "26", cm: "25.5" },
    { us: "9", uk: "8", eu: "42", jp: "27", cm: "26.5" },
    { us: "10", uk: "9", eu: "43", jp: "28", cm: "27.5" },
    { us: "11", uk: "10", eu: "44", jp: "29", cm: "28.5" },
    { us: "12", uk: "11", eu: "45", jp: "30", cm: "29.5" },
  ]

  const accessoriesSizes = [
    { type: "Belts", size: "S", measurement: unit === "in" ? "30-32" : "76-81" },
    { type: "Belts", size: "M", measurement: unit === "in" ? "34-36" : "86-91" },
    { type: "Belts", size: "L", measurement: unit === "in" ? "38-40" : "97-102" },
    { type: "Gloves", size: "S", measurement: unit === "in" ? "7-7.5" : "18-19" },
    { type: "Gloves", size: "M", measurement: unit === "in" ? "8-8.5" : "20-22" },
    { type: "Gloves", size: "L", measurement: unit === "in" ? "9-9.5" : "23-24" },
    { type: "Hats", size: "S", measurement: unit === "in" ? "21-21.5" : "53-55" },
    { type: "Hats", size: "M", measurement: unit === "in" ? "22-22.5" : "56-57" },
    { type: "Hats", size: "L", measurement: unit === "in" ? "23-23.5" : "58-60" },
  ]

  const renderTable = (currentCategory: string, currentUnit: string) => {
    switch (currentCategory) {
      case "mens":
        return (
          <SizeGuideTable
            headers={["Size", `Chest (${currentUnit})`, `Waist (${currentUnit})`, `Hips (${currentUnit})`]}
            data={mensClothingSizes.map((size) => [size.size, size.chest, size.waist, size.hips])}
          />
        )
      case "womens":
        return (
          <SizeGuideTable
            headers={["Size", `Bust (${currentUnit})`, `Waist (${currentUnit})`, `Hips (${currentUnit})`]}
            data={womensClothingSizes.map((size) => [size.size, size.bust, size.waist, size.hips])}
          />
        )
      case "kids":
        return (
          <SizeGuideTable
            headers={["Size", `Height (${currentUnit})`, "Weight", `Chest (${currentUnit})`]}
            data={kidsClothingSizes.map((size) => [size.size, size.height, size.weight, size.chest])}
          />
        )
      case "shoes":
        return (
          <SizeGuideTable
            headers={["US", "UK", "EU", "JP", "CM"]}
            data={footwearSizes.map((size) => [size.us, size.uk, size.eu, size.jp, size.cm])}
          />
        )
      case "accessories":
        return (
          <SizeGuideTable
            headers={["Type", "Size", `Measurement (${currentUnit})`]}
            data={accessoriesSizes.map((size) => [size.type, size.size, size.measurement])}
          />
        )
      default:
        return null
    }
  }

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-[#2b2b2b]">Size Charts</h2>
          <p className="text-muted-foreground max-w-3xl">
            Find the perfect size for all our products with our detailed size charts.
          </p>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  cat.id === "mens" ? "bg-black text-white" : "bg-black hover:bg-[#2b2b2b]/80 text-white"
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>
          <div className="flex items-center space-x-2 bg-[#F6F6F6] rounded-full p-1">
            <span className="px-3 py-1 rounded-full text-sm bg-[#F6F6F6] text-black">Inches</span>
            <span className="px-3 py-1 rounded-full text-sm hover:bg-[#F6F6F6]/80 text-black">Centimeters</span>
          </div>
        </div>

        <div className="bg-[#F6F6F6] rounded-lg border border-[#2b2b2b] shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-[#2b2b2b]">
            <thead>
              <tr className="bg-[#F6F6F6]">
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Chest (in)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Waist (in)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Hips (in)
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#F6F6F6] divide-y divide-[#2b2b2b]">
              {mensClothingSizes.map((size, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-[#F6F6F6]" : "bg-[#F6F6F6]"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{size.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">{size.chest}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">{size.waist}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">{size.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-[#666666]">
          Note: These measurements are body measurements, not garment measurements. For a more relaxed fit, we recommend
          sizing up.
        </p>
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
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-[#2b2b2b]">Size Charts</h2>
      <p className="text-[#666666] max-w-3xl mb-6">
        Find the perfect size for all our products with our detailed size charts.
      </p>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                category === cat.id ? "bg-[#F6F6F6] text-black" : "bg-[#F6F6F6] hover:bg-[#F6F6F6]/80 text-black"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 bg-[#F6F6F6] rounded-full p-1">
          <button
            onClick={() => {
              setUnit("in")
            }}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              unit === "in" ? "bg-[#F6F6F6] text-black" : "text-black hover:bg-[#F6F6F6]/80"
            }`}
          >
            Inches
          </button>
          <button
            onClick={() => {
              setUnit("cm")
            }}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              unit === "cm" ? "bg-[#F6F6F6] text-black" : "text-black hover:bg-[#F6F6F6]/80"
            }`}
          >
            Centimeters
          </button>
        </div>
      </div>

      <div className="bg-[#F6F6F6] rounded-lg border border-[#2b2b2b] shadow-sm overflow-hidden">
        {renderTable(category, unit)}
      </div>

      <p className="text-sm text-[#666666]">
        Note: These measurements are body measurements, not garment measurements. For a more relaxed fit, we recommend
        sizing up.
      </p>
    </motion.div>
  )
}
