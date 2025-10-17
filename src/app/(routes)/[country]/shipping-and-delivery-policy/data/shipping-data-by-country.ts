export interface ShippingMethod {
    icon: string
    title: string
    description: string
    features: string[]
}

export interface ShippingTimelineStep {
    title: string
    description: string
}

export interface ShippingRate {
    order: string
    standard: string
}

export interface ShippingFeature {
    title: string
    description: string
}

export interface ShippingFAQ {
    question: string
    answer: string
}

export interface ShippingContact {
    title: string
    description: string
    contact: string
    action: string
    icon?: string
    type?: string
}

export interface ShippingPolicyData {
    title: string
    description: string
    lastUpdated: string
    contactEmail: string
    contactAddress: string
    heroFeatures: string[]
    shippingMethods: ShippingMethod[]
    timelineSteps: ShippingTimelineStep[]
    shippingRates: ShippingRate[]
    shippingFeatures: ShippingFeature[]
    faqs: ShippingFAQ[]
    contactOptions: ShippingContact[]
}

export interface ShippingPolicyDataMap {
    [countryCode: string]: ShippingPolicyData
}

const usShippingData: ShippingPolicyData = {
    title: "Shipping & Delivery Policy",
    description: "Fast, reliable shipping to your doorstep, anywhere in the world",
    lastUpdated: "December 2024",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, San Francisco, CA 94103, United States",
    heroFeatures: ["Fast Shipping", "Secure Packaging", "Global Delivery", "Real-time Tracking"],
    shippingMethods: [
        {
            icon: "Truck",
            title: "Standard Shipping",
            description: "Delivery within 3-4 business days",
            features: ["Tracking included", "Signature on delivery optional", "Available for most locations"],
        },
    ],
    timelineSteps: [
        {
            title: "Order Placed",
            description: "Your order is confirmed and payment is processed",
        },
        {
            title: "Order Processing",
            description: "Items are picked, packed and prepared for shipping",
        },
        {
            title: "Order Shipped",
            description: "Your package is on its way with tracking information sent to you",
        },
        {
            title: "Order Delivered",
            description: "Your package has been delivered to your specified address",
        },
    ],
    shippingRates: [
        { order: "Orders under $50", standard: "$5.99" },
        { order: "Orders $50-$100", standard: "$3.99" },
        { order: "Orders over $100", standard: "FREE" },
    ],
    shippingFeatures: [
        {
            title: "Free Shipping Threshold",
            description: "Enjoy free standard shipping on all domestic orders over $100.",
        },
        {
            title: "Promotional Discounts",
            description: "Watch for special promotions that may include discounted or free shipping.",
        },
        {
            title: "Shipping Protection",
            description: "All packages include basic shipping protection against loss or damage.",
        },
    ],
    faqs: [
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a shipping confirmation email with a tracking number and link. You can also track your order by logging into your account and viewing your order history.",
        },
        {
            question: "What if my package is lost or damaged?",
            answer: "If your package is lost or damaged during transit, please contact our customer service team within 14 days of the expected delivery date. We'll work with the shipping carrier to locate your package or process a replacement shipment.",
        },
        {
            question: "Can I change my shipping address after placing an order?",
            answer: "We can only change the shipping address if the order hasn't been processed yet. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been shipped, we cannot redirect it to a different address.",
        },
    ],
     contactOptions: [
         {
             title: "Email Us",
             description: "Get a response within 24 hours",
             contact: "info@fineystjackets.com",
             action: "Send Email",
             icon: "Mail",
             type: "email",
         },
         {
             title: "Call Us",
             description: "Available Mon-Fri, 9am-5pm EST",
             contact: "+1 (888) 840-0885",
             action: "Call Now",
             icon: "Phone",
             type: "phone",
         },
         {
             title: "Live Chat",
             description: "Get instant assistance",
             contact: "Available 24/7",
             action: "Start Chat",
             icon: "MessageSquare",
             type: "chat",
         },
     ],
}

const ukShippingData: ShippingPolicyData = {
    title: "Shipping & Delivery Policy",
    description: "Fast, reliable shipping to your doorstep across the United Kingdom",
    lastUpdated: "December 2024",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, London, UK SW1A 1AA",
    heroFeatures: ["Fast Shipping", "Secure Packaging", "Reliable Delivery", "Real-time Tracking"],
    shippingMethods: [
        {
            icon: "Truck",
            title: "Standard Shipping",
            description: "Delivery within 3-4 business days",
            features: ["Tracking included", "Signature on delivery optional", "Available for most locations"],
        },
    ],
    timelineSteps: [
        {
            title: "Order Placed",
            description: "Your order is confirmed and payment is processed",
        },
        {
            title: "Order Processing",
            description: "Items are picked, packed and prepared for shipping",
        },
        {
            title: "Order Shipped",
            description: "Your package is on its way with tracking information sent to you",
        },
        {
            title: "Order Delivered",
            description: "Your package has been delivered to your specified address",
        },
    ],
    shippingRates: [
        { order: "Orders under £50", standard: "£4.99" },
        { order: "Orders £50-£100", standard: "£2.99" },
        { order: "Orders over £100", standard: "FREE" },
    ],
    shippingFeatures: [
        {
            title: "Free Shipping Threshold",
            description: "Enjoy free standard shipping on all domestic orders over £100.",
        },
        {
            title: "Promotional Discounts",
            description: "Watch for special promotions that may include discounted or free shipping.",
        },
        {
            title: "Shipping Protection",
            description: "All packages include basic shipping protection against loss or damage.",
        },
    ],
    faqs: [
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a shipping confirmation email with a tracking number and link. You can also track your order by logging into your account and viewing your order history.",
        },
        {
            question: "What if my package is lost or damaged?",
            answer: "If your package is lost or damaged during transit, please contact our customer service team within 14 days of the expected delivery date. We'll work with the shipping carrier to locate your package or process a replacement shipment.",
        },
        {
            question: "Can I change my shipping address after placing an order?",
            answer: "We can only change the shipping address if the order hasn't been processed yet. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been shipped, we cannot redirect it to a different address.",
        },
    ],
     contactOptions: [
         {
             title: "Email Us",
             description: "Get a response within 24 hours",
             contact: "info@fineystjackets.com",
             action: "Send Email",
             icon: "Mail",
             type: "email",
         },
         {
             title: "Call Us",
             description: "Available Mon-Fri, 9am-5pm GMT",
             contact: "+44 (0) 20 7946 0958",
             action: "Call Now",
             icon: "Phone",
             type: "phone",
         },
         {
             title: "Live Chat",
             description: "Get instant assistance",
             contact: "Available 24/7",
             action: "Start Chat",
             icon: "MessageSquare",
             type: "chat",
         },
     ],
}

const caShippingData: ShippingPolicyData = {
    title: "Shipping & Delivery Policy",
    description: "Fast, reliable shipping to your doorstep across Canada",
    lastUpdated: "December 2024",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Toronto, ON M5H 2N2, Canada",
    heroFeatures: ["Fast Shipping", "Secure Packaging", "Global Delivery", "Real-time Tracking"],
    shippingMethods: [
        {
            icon: "Truck",
            title: "Standard Shipping",
            description: "Delivery within 3-4 business days",
            features: ["Tracking included", "Signature on delivery optional", "Available for most locations"],
        },
    ],
    timelineSteps: [
        {
            title: "Order Placed",
            description: "Your order is confirmed and payment is processed",
        },
        {
            title: "Order Processing",
            description: "Items are picked, packed and prepared for shipping",
        },
        {
            title: "Order Shipped",
            description: "Your package is on its way with tracking information sent to you",
        },
        {
            title: "Order Delivered",
            description: "Your package has been delivered to your specified address",
        },
    ],
    shippingRates: [
        { order: "Orders under $50 CAD", standard: "$7.99 CAD" },
        { order: "Orders $50-$100 CAD", standard: "$4.99 CAD" },
        { order: "Orders over $100 CAD", standard: "FREE" },
    ],
    shippingFeatures: [
        {
            title: "Free Shipping Threshold",
            description: "Enjoy free standard shipping on all domestic orders over $100 CAD.",
        },
        {
            title: "Promotional Discounts",
            description: "Watch for special promotions that may include discounted or free shipping.",
        },
        {
            title: "Shipping Protection",
            description: "All packages include basic shipping protection against loss or damage.",
        },
    ],
    faqs: [
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a shipping confirmation email with a tracking number and link. You can also track your order by logging into your account and viewing your order history.",
        },
        {
            question: "What if my package is lost or damaged?",
            answer: "If your package is lost or damaged during transit, please contact our customer service team within 14 days of the expected delivery date. We'll work with the shipping carrier to locate your package or process a replacement shipment.",
        },
        {
            question: "Can I change my shipping address after placing an order?",
            answer: "We can only change the shipping address if the order hasn't been processed yet. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been shipped, we cannot redirect it to a different address.",
        },
    ],
     contactOptions: [
         {
             title: "Email Us",
             description: "Get a response within 24 hours",
             contact: "info@fineystjackets.com",
             action: "Send Email",
             icon: "Mail",
             type: "email",
         },
         {
             title: "Call Us",
             description: "Available Mon-Fri, 9am-5pm EST",
             contact: "+1 (416) 555-0123",
             action: "Call Now",
             icon: "Phone",
             type: "phone",
         },
         {
             title: "Live Chat",
             description: "Get instant assistance",
             contact: "Available 24/7",
             action: "Start Chat",
             icon: "MessageSquare",
             type: "chat",
         },
     ],
}

const auShippingData: ShippingPolicyData = {
    title: "Shipping & Delivery Policy",
    description: "Fast, reliable shipping to your doorstep across Australia",
    lastUpdated: "December 2024",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Sydney, NSW 2000, Australia",
    heroFeatures: ["Fast Shipping", "Secure Packaging", "Reliable Delivery", "Real-time Tracking"],
    shippingMethods: [
        {
            icon: "Truck",
            title: "Standard Shipping",
            description: "Delivery within 3-4 business days",
            features: ["Tracking included", "Signature on delivery optional", "Available for most locations"],
        },
    ],
    timelineSteps: [
        {
            title: "Order Placed",
            description: "Your order is confirmed and payment is processed",
        },
        {
            title: "Order Processing",
            description: "Items are picked, packed and prepared for shipping",
        },
        {
            title: "Order Shipped",
            description: "Your package is on its way with tracking information sent to you",
        },
        {
            title: "Order Delivered",
            description: "Your package has been delivered to your specified address",
        },
    ],
    shippingRates: [
        { order: "Orders under $50 AUD", standard: "$8.99 AUD" },
        { order: "Orders $50-$100 AUD", standard: "$5.99 AUD" },
        { order: "Orders over $100 AUD", standard: "FREE" },
    ],
    shippingFeatures: [
        {
            title: "Free Shipping Threshold",
            description: "Enjoy free standard shipping on all domestic orders over $100 AUD.",
        },
        {
            title: "Promotional Discounts",
            description: "Watch for special promotions that may include discounted or free shipping.",
        },
        {
            title: "Shipping Protection",
            description: "All packages include basic shipping protection against loss or damage.",
        },
    ],
    faqs: [
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a shipping confirmation email with a tracking number and link. You can also track your order by logging into your account and viewing your order history.",
        },
        {
            question: "What if my package is lost or damaged?",
            answer: "If your package is lost or damaged during transit, please contact our customer service team within 14 days of the expected delivery date. We'll work with the shipping carrier to locate your package or process a replacement shipment.",
        },
        {
            question: "Can I change my shipping address after placing an order?",
            answer: "We can only change the shipping address if the order hasn't been processed yet. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been shipped, we cannot redirect it to a different address.",
        },
    ],
     contactOptions: [
         {
             title: "Email Us",
             description: "Get a response within 24 hours",
             contact: "info@fineystjackets.com",
             action: "Send Email",
             icon: "Mail",
             type: "email",
         },
         {
             title: "Call Us",
             description: "Available Mon-Fri, 9am-5pm AEST",
             contact: "+61 2 5555 0123",
             action: "Call Now",
             icon: "Phone",
             type: "phone",
         },
         {
             title: "Live Chat",
             description: "Get instant assistance",
             contact: "Available 24/7",
             action: "Start Chat",
             icon: "MessageSquare",
             type: "chat",
         },
     ],
}

export const shippingPolicyDataByCountry: ShippingPolicyDataMap = {
    us: usShippingData,
    uk: ukShippingData,
    ca: caShippingData,
    au: auShippingData,
}

export function getShippingPolicyData(countryCode: string): ShippingPolicyData {
    const normalizedCountryCode = countryCode.toLowerCase()
    return shippingPolicyDataByCountry[normalizedCountryCode] || shippingPolicyDataByCountry.us
}

export function getAvailableShippingCountryCodes(): string[] {
    return Object.keys(shippingPolicyDataByCountry)
}
