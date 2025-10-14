import { ShoppingBag, Truck, RotateCcw, CreditCard, Shield } from "lucide-react"

export const faqData = [
  {
    category: "products",
    title: "Products & Sizing",
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    items: [
      {
        question: "How do I find my correct size?",
        answer:
          "We recommend using our detailed size guide available on our website. You can find specific measurements for each garment type and compare them with your own measurements. For the most accurate fit, we suggest measuring a similar item from your wardrobe that fits you well and comparing those measurements with our size charts.",
      },
      {
        question: "Are your products true to size?",
        answer:
          "Our products generally run true to size, but we recommend checking the specific size guide for each item as sizing can vary slightly between different styles and collections. Customer reviews often include feedback on sizing that may be helpful as well.",
      },
      {
        question: "Do you offer custom tailoring?",
        answer:
          "We currently don't offer custom tailoring services, but many of our premium items are designed with a bit of extra fabric at the seams to allow for minor alterations by your local tailor if needed.",
      },
      {
        question: "What materials do you use in your clothing?",
        answer:
          "We use a variety of high-quality materials including organic cotton, premium wool blends, sustainable viscose, and recycled polyester. Each product page lists the specific materials used for that item, along with care instructions.",
      },
      {
        question: "How should I care for my Fineyst garments?",
        answer:
          "Each item comes with specific care instructions on the label. Generally, we recommend washing in cold water and hanging to dry to preserve the quality and fit of your garments. For premium items, dry cleaning is often recommended to maintain the fabric quality and construction.",
      },
    ],
  },
  {
    category: "shipping",
    title: "Shipping & Delivery",
    icon: <Truck className="h-6 w-6 text-primary" />,
    items: [
      {
        question: "How long will it take to receive my order?",
        answer:
          "Domestic orders typically arrive within 3-5 business days. International shipping times vary by location, generally taking 7-14 business days. During peak seasons or sales, processing times may be slightly longer. You'll receive a tracking number once your order ships so you can monitor its progress.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 100 countries worldwide. International shipping times vary by location, typically taking 7-14 business days. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.",
      },
      {
        question: "Is expedited shipping available?",
        answer:
          "Yes, we offer expedited shipping options at checkout for most destinations. Expedited domestic orders typically arrive within 1-2 business days, while international expedited shipping takes 3-5 business days depending on the destination.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history. Our tracking system provides real-time updates on your package's location and estimated delivery date.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "We offer free standard shipping on domestic orders over $100 and international orders over $200. Free shipping promotions are also available during special sales events throughout the year.",
      },
    ],
  },
  {
    category: "returns",
    title: "Returns & Exchanges",
    icon: <RotateCcw className="h-6 w-6 text-primary" />,
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for all unworn items in their original condition with tags attached. Returns are processed within 14 business days of receipt. For hygiene reasons, underwear, swimwear, and face masks cannot be returned unless they are defective.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "To initiate a return, log into your account, go to your order history, and select the 'Return Items' option for the relevant order. Follow the prompts to generate a return label and instructions. If you checked out as a guest, you can use the return link in your order confirmation email.",
      },
      {
        question: "Do you offer free returns?",
        answer:
          "Yes, we offer free returns for domestic orders. For international returns, the customer is responsible for return shipping costs unless the item is defective or we made an error in your order.",
      },
      {
        question: "Can I exchange an item for a different size or color?",
        answer:
          "Yes, we offer free size exchanges within 30 days of purchase. Simply initiate an exchange through your account or contact our customer service team. For color exchanges, you'll need to return the original item and place a new order for the desired color.",
      },
      {
        question: "How long does it take to process a refund?",
        answer:
          "Once we receive your return, it typically takes 3-5 business days to inspect and process. Refunds are issued to the original payment method and may take an additional 5-10 business days to appear on your statement, depending on your financial institution.",
      },
    ],
  },
  {
    category: "payment",
    title: "Payment & Discounts",
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. For select countries, we also offer buy-now-pay-later options like Klarna, Afterpay, and Affirm.",
      },
      {
        question: "Is it safe to use my credit card on your website?",
        answer:
          "Yes, our website uses industry-standard SSL encryption to protect your personal and payment information. We are PCI DSS compliant and never store your full credit card details on our servers. Additionally, we implement multiple security measures to ensure your data remains safe.",
      },
      {
        question: "Do you offer discounts for first-time customers?",
        answer:
          "Yes, first-time customers can receive 10% off their first order by subscribing to our newsletter. The discount code will be sent to your email after subscription confirmation.",
      },
      {
        question: "How can I use a promo code?",
        answer:
          "To use a promo code, add items to your cart and proceed to checkout. You'll find a field labeled 'Promo Code' or 'Discount Code' where you can enter your code. Click 'Apply' to see the discount reflected in your order total before completing your purchase.",
      },
      {
        question: "Do you have a loyalty program?",
        answer:
          "Yes, our Fineyst Rewards program allows you to earn points on every purchase that can be redeemed for discounts on future orders. You also receive exclusive access to member-only sales, early access to new collections, and special birthday rewards.",
      },
    ],
  },
  {
    category: "account",
    title: "Account & Privacy",
    icon: <Shield className="h-6 w-6 text-primary" />,
    items: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking the 'Account' icon in the top right corner of our website and selecting 'Register'. Alternatively, you can create an account during the checkout process. You'll need to provide your email address and create a password.",
      },
      {
        question: "How can I reset my password?",
        answer:
          "To reset your password, click on the 'Account' icon, select 'Login', and then click on 'Forgot Password'. Enter the email address associated with your account, and we'll send you instructions to reset your password.",
      },
      {
        question: "How do you protect my personal information?",
        answer:
          "We take data protection seriously and comply with global privacy regulations. Your personal information is encrypted and stored securely. We never sell your data to third parties and only use it for processing your orders and enhancing your shopping experience. For more details, please review our Privacy Policy.",
      },
      {
        question: "Can I update my shipping address after placing an order?",
        answer:
          "Address changes are possible only if your order hasn't entered the fulfillment process. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been processed for shipping, address changes are not possible.",
      },
      {
        question: "How can I unsubscribe from marketing emails?",
        answer:
          "You can unsubscribe from our marketing emails by clicking the 'Unsubscribe' link at the bottom of any marketing email we send. Alternatively, you can update your communication preferences in your account settings. Please note that even if you unsubscribe, you'll still receive transactional emails related to your orders.",
      },
    ],
  },
]
