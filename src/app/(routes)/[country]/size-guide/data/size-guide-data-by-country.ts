export interface SizeGuideFeature {
  icon: string
  text: string
}

export interface SizeChartData {
  categories: Array<{
    id: string
    label: string
  }>
  mensClothingSizes: Array<{
    size: string
    chest: string
    waist: string
    hips: string
  }>
  womensClothingSizes: Array<{
    size: string
    bust: string
    waist: string
    hips: string
  }>
  kidsClothingSizes: Array<{
    size: string
    height: string
    weight: string
    chest: string
  }>
  footwearSizes: Array<{
    us: string
    uk: string
    eu: string
    jp: string
    cm: string
  }>
  accessoriesSizes: Array<{
    type: string
    size: string
    measurement: string
  }>
  note: string
}

export interface MeasurementStep {
  title: string
  description: string
  image: string
}

export interface MeasurementGuideData {
  title: string
  description: string
  measurementSteps: MeasurementStep[]
  tips: string[]
}

export interface SizeConversionData {
  title: string
  description: string
  categories: Array<{
    id: string
    label: string
  }>
  clothingSizeConversion: Array<{
    us: string
    uk: string
    eu: string
    international: string
  }>
  shoesSizeConversion: Array<{
    us: string
    uk: string
    eu: string
    cm: string
  }>
  accessoriesSizeConversion: Array<{
    type: string
    us: string
    uk: string
    eu: string
    cm: string
  }>
  tips: string[]
}

export interface FitType {
  title: string
  description: string
  image: string
  bestFor: string[]
}

export interface FitGuideData {
  title: string
  description: string
  fitTypes: FitType[]
  tips: string[]
}

export interface InteractiveModelData {
  title: string
  description: string
  bodyTypes: Array<{
    id: string
    label: string
  }>
  heights: Array<{
    id: string
    label: string
  }>
  sizeRecommendations: {
    [key: string]: string
  }
  fitRecommendations: {
    [key: string]: string
  }
  note: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQData {
  title: string
  description: string
  faqs: FAQItem[]
  contactInfo: {
    email: string
    phone: string
    text: string
  }
}

export interface CTAData {
  title: string
  description: string
  buttons: Array<{
    text: string
    href: string
    variant: "primary" | "secondary"
  }>
}

export interface SizeGuideData {
  title: string
  description: string
  heroFeatures: SizeGuideFeature[]
  sizeCharts: SizeChartData
  measurementGuide: MeasurementGuideData
  sizeConversion: SizeConversionData
  fitGuide: FitGuideData
  interactiveModel: InteractiveModelData
  faq: FAQData
  cta: CTAData
}

export interface SizeGuideDataMap {
  [countryCode: string]: SizeGuideData
}

// US Data
const usSizeGuideData: SizeGuideData = {
  title: "Complete Size Guide for Jackets & Outerwear",
  description: "Find your perfect fit with our comprehensive sizing guide",
  heroFeatures: [
    {
      icon: "Ruler",
      text: "Accurate Sizing"
    },
    {
      icon: "Users",
      text: "All Body Types"
    },
    {
      icon: "CheckCircle",
      text: "Perfect Fit"
    },
    {
      icon: "Shirt",
      text: "Easy Guide"
    }
  ],
  sizeCharts: {
    categories: [
      { id: "mens", label: "Men's Clothing" },
      { id: "womens", label: "Women's Clothing" },
      { id: "kids", label: "Kids' Clothing" },
      { id: "shoes", label: "Footwear" },
      { id: "accessories", label: "Accessories" }
    ],
    mensClothingSizes: [
      { size: "XS", chest: "34-36", waist: "28-30", hips: "34-36" },
      { size: "S", chest: "36-38", waist: "30-32", hips: "36-38" },
      { size: "M", chest: "38-40", waist: "32-34", hips: "38-40" },
      { size: "L", chest: "40-42", waist: "34-36", hips: "40-42" },
      { size: "XL", chest: "42-44", waist: "36-38", hips: "42-44" },
      { size: "XXL", chest: "44-46", waist: "38-40", hips: "44-46" }
    ],
    womensClothingSizes: [
      { size: "XS", bust: "32-33", waist: "24-25", hips: "34-35" },
      { size: "S", bust: "34-35", waist: "26-27", hips: "36-37" },
      { size: "M", bust: "36-37", waist: "28-29", hips: "38-39" },
      { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
      { size: "XL", bust: "41-43", waist: "33-35", hips: "43-45" },
      { size: "XXL", bust: "44-46", waist: "36-38", hips: "46-48" }
    ],
    kidsClothingSizes: [
      { size: "2T", height: "33-35", weight: "28-32 lbs", chest: "21" },
      { size: "3T", height: "35-38", weight: "32-35 lbs", chest: "22" },
      { size: "4T", height: "38-41", weight: "35-39 lbs", chest: "23" },
      { size: "5", height: "41-44", weight: "39-45 lbs", chest: "24" },
      { size: "6", height: "44-47", weight: "45-50 lbs", chest: "25" },
      { size: "7", height: "47-50", weight: "50-59 lbs", chest: "26" }
    ],
    footwearSizes: [
      { us: "6", uk: "5", eu: "39", jp: "24", cm: "23.5" },
      { us: "7", uk: "6", eu: "40", jp: "25", cm: "24.5" },
      { us: "8", uk: "7", eu: "41", jp: "26", cm: "25.5" },
      { us: "9", uk: "8", eu: "42", jp: "27", cm: "26.5" },
      { us: "10", uk: "9", eu: "43", jp: "28", cm: "27.5" },
      { us: "11", uk: "10", eu: "44", jp: "29", cm: "28.5" },
      { us: "12", uk: "11", eu: "45", jp: "30", cm: "29.5" }
    ],
    accessoriesSizes: [
      { type: "Belts", size: "S", measurement: "30-32" },
      { type: "Belts", size: "M", measurement: "34-36" },
      { type: "Belts", size: "L", measurement: "38-40" },
      { type: "Gloves", size: "S", measurement: "7-7.5" },
      { type: "Gloves", size: "M", measurement: "8-8.5" },
      { type: "Gloves", size: "L", measurement: "9-9.5" },
      { type: "Hats", size: "S", measurement: "21-21.5" },
      { type: "Hats", size: "M", measurement: "22-22.5" },
      { type: "Hats", size: "L", measurement: "23-23.5" }
    ],
    note: "Note: These measurements are body measurements, not garment measurements. For a more relaxed fit, we recommend sizing up."
  },
  measurementGuide: {
    title: "How to Measure",
    description: "Follow these simple steps to take accurate measurements for the perfect fit.",
    measurementSteps: [
      {
        title: "Chest / Bust",
        description: "Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal and not too tight.",
        image: "/images/size-guide/chest-bust.webp"
      },
      {
        title: "Waist",
        description: "Measure around your natural waistline, which is the narrowest part of your torso, typically above your belly button.",
        image: "/images/size-guide/waist.webp"
      },
      {
        title: "Hips",
        description: "Measure around the fullest part of your hips, usually about 8 inches below your waistline.",
        image: "/images/size-guide/hips.webp"
      },
      {
        title: "Inseam",
        description: "Measure from the crotch seam to the bottom of the leg along the inside of the leg.",
        image: "/images/size-guide/inseam.webp"
      }
    ],
    tips: [
      "Use a soft measuring tape, not a metal one.",
      "Wear minimal clothing or measure directly against your skin.",
      "Stand straight with feet together when taking measurements.",
      "Keep the measuring tape snug but not tight.",
      "Have someone help you for more accurate measurements.",
      "Measure twice to ensure accuracy."
    ]
  },
  sizeConversion: {
    title: "Size Conversion",
    description: "Convert between different international sizing systems to find your perfect fit.",
    categories: [
      { id: "clothing", label: "Clothing" },
      { id: "shoes", label: "Shoes" },
      { id: "accessories", label: "Accessories" }
    ],
    clothingSizeConversion: [
      { us: "XS", uk: "6", eu: "34", international: "XXS" },
      { us: "S", uk: "8", eu: "36", international: "XS" },
      { us: "M", uk: "10", eu: "38", international: "S" },
      { us: "L", uk: "12", eu: "40", international: "M" },
      { us: "XL", uk: "14", eu: "42", international: "L" },
      { us: "XXL", uk: "16", eu: "44", international: "XL" }
    ],
    shoesSizeConversion: [
      { us: "5", uk: "3", eu: "35", cm: "22" },
      { us: "6", uk: "4", eu: "36", cm: "23" },
      { us: "7", uk: "5", eu: "37", cm: "24" },
      { us: "8", uk: "6", eu: "38", cm: "25" },
      { us: "9", uk: "7", eu: "39", cm: "26" },
      { us: "10", uk: "8", eu: "40", cm: "27" },
      { us: "11", uk: "9", eu: "41", cm: "28" }
    ],
    accessoriesSizeConversion: [
      { type: "Hats", us: "S", uk: "6 3/4", eu: "54", cm: "54-55" },
      { type: "Hats", us: "M", uk: "7", eu: "56", cm: "56-57" },
      { type: "Hats", us: "L", uk: "7 1/4", eu: "58", cm: "58-59" },
      { type: "Gloves", us: "S", uk: "7", eu: "7", cm: "18" },
      { type: "Gloves", us: "M", uk: "8", eu: "8", cm: "20" },
      { type: "Gloves", us: "L", uk: "9", eu: "9", cm: "23" }
    ],
    tips: [
      "Sizes can vary between brands, so always check the specific brand's size chart when available.",
      "When in doubt, go with your measurements rather than your usual size.",
      "European sizes tend to run smaller than US sizes, so you may need to size up."
    ]
  },
  fitGuide: {
    title: "Fit Guide",
    description: "Understand the different fits we offer to find the style that suits you best.",
    fitTypes: [
      {
        title: "Slim Fit",
        description: "Our slim fit is tailored close to the body with a narrower cut through the chest, waist, and hips. Ideal for a modern, streamlined look.",
        image: "/images/size-guide/slim-fit.webp",
        bestFor: ["Lean or athletic builds", "Modern, fashion-forward style", "Layering under jackets"]
      },
      {
        title: "Regular Fit",
        description: "Our regular fit offers a balanced cut that's neither too tight nor too loose. Comfortable through the chest, waist, and hips with room to move.",
        image: "/images/size-guide/regular-fit.webp",
        bestFor: ["Most body types", "Everyday wear", "Business casual settings"]
      },
      {
        title: "Relaxed Fit",
        description: "Our relaxed fit provides a generous cut with extra room through the chest, waist, and hips for maximum comfort and ease of movement.",
        image: "/images/size-guide/relaxed-fit.webp",
        bestFor: ["Fuller figures", "Comfort-focused style", "Casual, laid-back looks"]
      },
      {
        title: "Oversized Fit",
        description: "Our oversized fit features an extra roomy cut throughout for a trendy, statement-making silhouette that's both comfortable and stylish.",
        image: "/images/size-guide/oversized-fit.webp",
        bestFor: ["Street style looks", "Layered outfits", "Making a fashion statement"]
      }
    ],
    tips: [
      "If you're between sizes, size up for a relaxed fit or size down for a more fitted look.",
      "Consider your body type when choosing a fit. Different fits flatter different body shapes.",
      "Remember that fabrics with stretch will provide more give and comfort regardless of the fit."
    ]
  },
  interactiveModel: {
    title: "Interactive Size Visualization",
    description: "Visualize how different sizes look on different body types.",
    bodyTypes: [
      { id: "slim", label: "Slim" },
      { id: "average", label: "Average" },
      { id: "athletic", label: "Athletic" },
      { id: "plus", label: "Plus Size" }
    ],
    heights: [
      { id: "petite", label: "Petite (5'3\" and under)" },
      { id: "average", label: "Average (5'4\" - 5'8\")" },
      { id: "tall", label: "Tall (5'9\" and above)" }
    ],
    sizeRecommendations: {
      "female-slim": "XS or S depending on height",
      "female-average": "S or M depending on height",
      "female-athletic": "M or L depending on muscle mass",
      "female-plus": "L, XL, or XXL depending on measurements",
      "male-slim": "S or M depending on height",
      "male-average": "M or L depending on height",
      "male-athletic": "L or XL depending on muscle mass",
      "male-plus": "XL, XXL, or 3XL depending on measurements"
    },
    fitRecommendations: {
      "slim": "Regular or slim fit for a tailored look. Avoid oversized fits unless going for a specific style.",
      "average": "Regular fit works well for most items. Slim fit for a more tailored look, relaxed for comfort.",
      "athletic": "Regular or relaxed fit to accommodate broader shoulders and chest. Look for stretch fabrics.",
      "plus": "Relaxed or oversized fit for comfort. Look for stretch fabrics and avoid overly slim cuts."
    },
    note: "These are general recommendations. For the most accurate fit, always refer to the specific product's size chart and take your actual measurements."
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about sizing and fit.",
    faqs: [
      {
        question: "How do I know which size to choose?",
        answer: "We recommend taking your measurements and comparing them to our size charts. If you're between sizes, we generally recommend sizing up for a more comfortable fit. You can also check the fit description on each product page for specific guidance."
      },
      {
        question: "Do your clothes run true to size?",
        answer: "Our sizing is designed to be consistent with standard industry measurements. However, fit can vary slightly between different styles and fabrics. We recommend checking the specific product description and reviews for insights on how each item fits."
      },
      {
        question: "What if my measurements fall between two sizes?",
        answer: "If you're between sizes, we generally recommend sizing up for a more comfortable fit. However, this can depend on the specific garment and your personal preference for how fitted you like your clothes to be."
      },
      {
        question: "How do I measure myself accurately?",
        answer: "For the most accurate measurements, use a soft measuring tape and have someone help you if possible. Measure directly against your body, not over clothes. Stand straight with feet together and breathe normally. Check our 'How to Measure' section for detailed guidance on measuring specific body parts."
      },
      {
        question: "Do you offer petite or tall sizes?",
        answer: "Yes, we offer petite sizes for those 5'4\" and under, and tall sizes for those 5'9\" and above in select styles. Look for the 'petite' or 'tall' designation in the product description or filter your search results by these categories."
      },
      {
        question: "What size should I choose if I'm pregnant?",
        answer: "For maternity wear, we recommend selecting your pre-pregnancy size as our maternity items are designed to accommodate your changing body. For non-maternity items, we suggest sizing up based on your current measurements and choosing styles with stretch or a relaxed fit."
      },
      {
        question: "How do I convert my international size?",
        answer: "You can use our size conversion chart in the 'Size Conversion' section to find your equivalent size across different international sizing systems. If you're still unsure, please contact our customer service team for assistance."
      },
      {
        question: "What if the item I ordered doesn't fit?",
        answer: "If your item doesn't fit, you can return or exchange it within 30 days of purchase, provided it's unworn, unwashed, and has all original tags attached. Please visit our Returns & Exchanges page for more information on our return policy."
      }
    ],
    contactInfo: {
      email: "info@fineystjackets.com",
      phone: "+1 (888) 840-0885",
      text: "Still have questions about finding your perfect size? Our customer service team is here to help!"
    }
  },
  cta: {
    title: "Ready to Find Your Perfect Fit?",
    description: "Now that you know your size, explore our collection and shop with confidence.",
    buttons: [
      {
        text: "Shop Women's Collection",
        href: "/us/collections/womens-leather-bomber-jackets",
        variant: "primary"
      },
      {
        text: "Shop Men's Collection",
        href: "/us/collections/leather-bomber-jacket-mens",
        variant: "secondary"
      }
    ]
  }
}

// UK Data (with metric measurements)
const ukSizeGuideData: SizeGuideData = {
  ...usSizeGuideData,
  sizeCharts: {
    ...usSizeGuideData.sizeCharts,
    mensClothingSizes: [
      { size: "XS", chest: "86-91", waist: "71-76", hips: "86-91" },
      { size: "S", chest: "91-97", waist: "76-81", hips: "91-97" },
      { size: "M", chest: "97-102", waist: "81-86", hips: "97-102" },
      { size: "L", chest: "102-107", waist: "86-91", hips: "102-107" },
      { size: "XL", chest: "107-112", waist: "91-97", hips: "107-112" },
      { size: "XXL", chest: "112-117", waist: "97-102", hips: "112-117" }
    ],
    womensClothingSizes: [
      { size: "XS", bust: "81-84", waist: "61-64", hips: "86-89" },
      { size: "S", bust: "86-89", waist: "66-69", hips: "91-94" },
      { size: "M", bust: "91-94", waist: "71-74", hips: "97-99" },
      { size: "L", bust: "97-102", waist: "76-81", hips: "102-107" },
      { size: "XL", bust: "104-109", waist: "84-89", hips: "109-114" },
      { size: "XXL", bust: "112-117", waist: "91-97", hips: "117-122" }
    ],
    kidsClothingSizes: [
      { size: "2T", height: "84-89", weight: "13-15 kg", chest: "53" },
      { size: "3T", height: "89-97", weight: "15-16 kg", chest: "56" },
      { size: "4T", height: "97-104", weight: "16-18 kg", chest: "58" },
      { size: "5", height: "104-112", weight: "18-20 kg", chest: "61" },
      { size: "6", height: "112-119", weight: "20-23 kg", chest: "64" },
      { size: "7", height: "119-127", weight: "23-27 kg", chest: "66" }
    ],
    accessoriesSizes: [
      { type: "Belts", size: "S", measurement: "76-81" },
      { type: "Belts", size: "M", measurement: "86-91" },
      { type: "Belts", size: "L", measurement: "97-102" },
      { type: "Gloves", size: "S", measurement: "18-19" },
      { type: "Gloves", size: "M", measurement: "20-22" },
      { type: "Gloves", size: "L", measurement: "23-24" },
      { type: "Hats", size: "S", measurement: "53-55" },
      { type: "Hats", size: "M", measurement: "56-57" },
      { type: "Hats", size: "L", measurement: "58-60" }
    ]
  },
  measurementGuide: {
    ...usSizeGuideData.measurementGuide,
    measurementSteps: [
      {
        title: "Chest / Bust",
        description: "Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal and not too tight.",
        image: "/images/size-guide/chest-bust.webp"
      },
      {
        title: "Waist",
        description: "Measure around your natural waistline, which is the narrowest part of your torso, typically above your belly button.",
        image: "/images/size-guide/waist.webp"
      },
      {
        title: "Hips",
        description: "Measure around the fullest part of your hips, usually about 20cm below your waistline.",
        image: "/images/size-guide/hips.webp"
      },
      {
        title: "Inseam",
        description: "Measure from the crotch seam to the bottom of the leg along the inside of the leg.",
        image: "/images/size-guide/inseam.webp"
      }
    ]
  },
  interactiveModel: {
    ...usSizeGuideData.interactiveModel,
    heights: [
      { id: "petite", label: "Petite (160cm and under)" },
      { id: "average", label: "Average (163cm - 173cm)" },
      { id: "tall", label: "Tall (175cm and above)" }
    ]
  },
  cta: {
    title: "Ready to Find Your Perfect Fit?",
    description: "Now that you know your size, explore our collection and shop with confidence.",
    buttons: [
      {
        text: "Shop Women's Collection",
        href: "/uk/collections/womens-leather-bomber-jackets",
        variant: "primary"
      },
      {
        text: "Shop Men's Collection",
        href: "/uk/collections/leather-bomber-jacket-mens",
        variant: "secondary"
      }
    ]
  }
}

// Canada Data (same as US but with French support)
const caSizeGuideData: SizeGuideData = {
  ...usSizeGuideData,
  cta: {
    title: "Ready to Find Your Perfect Fit?",
    description: "Now that you know your size, explore our collection and shop with confidence.",
    buttons: [
      {
        text: "Shop Women's Collection",
        href: "/ca/collections/womens-leather-bomber-jackets",
        variant: "primary"
      },
      {
        text: "Shop Men's Collection",
        href: "/ca/collections/leather-bomber-jacket-mens",
        variant: "secondary"
      }
    ]
  }
}

// Australia Data (same as UK with metric)
const auSizeGuideData: SizeGuideData = {
  ...ukSizeGuideData,
  cta: {
    title: "Ready to Find Your Perfect Fit?",
    description: "Now that you know your size, explore our collection and shop with confidence.",
    buttons: [
      {
        text: "Shop Women's Collection",
        href: "/au/collections/womens-leather-bomber-jackets",
        variant: "primary"
      },
      {
        text: "Shop Men's Collection",
        href: "/au/collections/leather-bomber-jacket-mens",
        variant: "secondary"
      }
    ]
  }
}

export const sizeGuideDataByCountry: SizeGuideDataMap = {
  us: usSizeGuideData,
  uk: ukSizeGuideData,
  ca: caSizeGuideData,
  au: auSizeGuideData
}

export function getSizeGuideData(countryCode: string): SizeGuideData {
  const normalizedCountryCode = countryCode.toLowerCase()
  return sizeGuideDataByCountry[normalizedCountryCode] || sizeGuideDataByCountry.us
}

export function getAvailableSizeGuideCountryCodes(): string[] {
  return Object.keys(sizeGuideDataByCountry)
}