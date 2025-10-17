export interface TermsSubsection {
  title: string
  content: string[]
  listItems?: string[]
}

export interface TermsSection {
  title: string
  content: string[]
  subsections?: TermsSubsection[]
}

export interface TermsData {
  title: string
  description: string
  lastUpdated: string
  contactEmail: string
  contactAddress: string
  sections: {
    [key: string]: TermsSection
  }
}

export interface TermsDataMap {
  [countryCode: string]: TermsData
}

import { termsData as existingTermsData } from "./terms-data"

const ukTermsData: { [key: string]: TermsSection } = {
  definitions: {
    title: "Definitions",
    content: [
      "The terms 'we', 'us', and 'our' refer to Fineyst. 'You' refers to you, as a user of our website or our services.",
      "The following terminology applies to these Terms & Conditions, Privacy Statement, and any or all Agreements: 'Client', 'You', and 'Your' refers to you, the person accessing this website and accepting the Company's terms and conditions.",
    ],
    subsections: [
      {
        title: "Key Terms",
        content: ["The following key terms are used throughout this document:"],
        listItems: [
          "'User', 'You', and 'Your' refers to the person accessing this website.",
          "'The Company', 'Ourselves', 'We', and 'Us' refers to Fineyst.",
          "'Party' or 'Parties' refers to both you and ourselves, or either you or ourselves.",
          "'Content' means any intellectual property and materials accessible on our website.",
          "'Services' means our website, programs, products, and services offered.",
        ],
      },
    ],
  },
  account: {
    title: "User Accounts",
    content: [
      "When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on our website.",
      "You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for all activities that occur under your account or password.",
      "You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion.",
    ],
    subsections: [
      {
        title: "Account Security",
        content: [
          "You are responsible for safeguarding the password that you use to access our Services and for any activities or actions under your password. We encourage you to use 'strong' passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.",
        ],
      },
    ],
  },
  products: {
    title: "Products and Services",
    content: [
      "Fineyst offers a wide range of fashion products. We reserve the right to modify, discontinue, or update any product or service without prior notice.",
      "All descriptions of products and pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.",
    ],
    subsections: [
      {
        title: "Product Availability",
        content: [
          "We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the service will be corrected.",
        ],
      },
      {
        title: "Product Colors and Images",
        content: [
          "We have made every effort to display as accurately as possible the colors and images of our products that appear on the store. We cannot guarantee that your computer monitor's display of any color will be accurate.",
        ],
      },
    ],
  },
  ordering: {
    title: "Ordering and Payment",
    content: [
      "By placing an order through our website, you are confirming that you are legally capable of entering into binding contracts.",
      "When you place an order, we will send you an email confirming receipt of your order. This email confirmation will be produced automatically and will simply confirm that we have received your order. It does not mean that your order has been accepted by us.",
    ],
    subsections: [
      {
        title: "Order Acceptance",
        content: [
          "We may refuse to accept your order for the following non-exhaustive reasons:",
          "The product is out of stock, unavailable, or discontinued; there is an error in the price or product description; or your payment method is declined or not validated.",
        ],
      },
      {
        title: "Payment Methods",
        content: [
          "We accept various payment methods as indicated during the checkout process. All credit/debit cardholders are subject to validation checks and authorization by the card issuer.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping and Delivery",
    content: [
      "Delivery times displayed on our website are estimates only and commence from the date of shipment, not the date of order.",
      "Fineyst is not liable for any delays in shipments. Risk of loss and title for items purchased from our website pass to you upon delivery of the items to the carrier.",
    ],
    subsections: [
      {
        title: "International Shipping",
        content: [
          "For international shipments, you may be subject to import duties and taxes, which are levied once a shipment reaches your country. These additional charges are your responsibility as we have no control over these charges and cannot predict what they may be.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns and Refunds",
    content: [
      "Our returns policy forms part of these Terms & Conditions. Please refer to our dedicated Returns & Refunds page for detailed information on how to return products and obtain refunds.",
      "To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging. Certain types of goods are exempt from being returned.",
    ],
    subsections: [
      {
        title: "Return Process",
        content: [
          "To initiate a return, please contact our customer service team with your order number and details about the product you would like to return. We will provide you with instructions on how to ship the product back to us.",
        ],
      },
      {
        title: "Refunds",
        content: [
          "Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.",
          "If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within a certain number of days, depending on your card issuer's policies.",
        ],
      },
    ],
  },
  intellectual: {
    title: "Intellectual Property",
    content: [
      "The Service and its original content, features, and functionality are and will remain the exclusive property of Fineyst and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.",
      "Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Fineyst.",
    ],
  },
  liability: {
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, in no event shall Fineyst be liable for any indirect, punitive, incidental, special, consequential damages, or any damages whatsoever including, without limitation, damages for loss of use, data, or profits, arising out of or in any way connected with the use or performance of the Service.",
      "If, despite the other provisions of these Terms & Conditions, Fineyst is found to be liable to you for any damage or loss which arises out of or is in any way connected with your use of the website or any of our services, our liability shall in no event exceed the greater of (1) the total of any fees paid by you to Fineyst in the six months prior to the action giving rise to the liability, or (2) $100.00 USD.",
    ],
  },
  indemnification: {
    title: "Indemnification",
    content: [
      "You agree to defend, indemnify, and hold harmless Fineyst, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms & Conditions or your use of the Service.",
    ],
  },
  termination: {
    title: "Termination",
    content: [
      "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms & Conditions.",
      "If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms & Conditions which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
    ],
  },
  changes: {
    title: "Changes to Terms",
    content: [
      "We reserve the right, at our sole discretion, to modify or replace these Terms & Conditions at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
      "By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.",
    ],
  },
  governing: {
    title: "Governing Law",
    content: [
      "These Terms & Conditions shall be governed and construed in accordance with the laws of the state of California, United States, without regard to its conflict of law provisions.",
      "Our failure to enforce any right or provision of these Terms & Conditions will not be considered a waiver of those rights. If any provision of these Terms & Conditions is held to be invalid or unenforceable by a court, the remaining provisions of these Terms & Conditions will remain in effect.",
    ],
  },
  contact: {
    title: "Contact Information",
    content: [
      "If you have any questions about these Terms & Conditions, please contact us at:",
      "Fineyst Customer Service",
      "Email: info@fineystjackets.com",
      "Phone: 1-800-484-6267",
      "Address: 123 Fashion Avenue, Suite 500, San Francisco, CA 94103, United States",
    ],
  },
}

export const termsDataByCountry: TermsDataMap = {
  us: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, San Francisco, CA 94103, United States",
    sections: existingTermsData
  },

  uk: {
    title: "Terms & Conditions (UK)",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "legal@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, London, UK SW1A 1AA",
    sections: ukTermsData
  },

  ca: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "legal@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Toronto, ON M5H 2N2, Canada",
    sections: existingTermsData 
  },

  au: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "legal@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Sydney, NSW 2000, Australia",
    sections: existingTermsData 
  }
}

export function getTermsData(countryCode: string): TermsData {
  const normalizedCountryCode = countryCode.toLowerCase()
  
  return termsDataByCountry[normalizedCountryCode] || termsDataByCountry.us
}

export function getAvailableTermsCountryCodes(): string[] {
  return Object.keys(termsDataByCountry)
}
