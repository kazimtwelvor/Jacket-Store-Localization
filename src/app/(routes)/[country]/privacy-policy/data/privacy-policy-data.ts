export interface PrivacySection {
  title: string
  content: string[]
  subsections?: {
    title: string
    content: string[]
    listItems?: string[]
  }[]
}

export interface PrivacyPolicyData {
  title: string
  description: string
  lastUpdated: string
  contactEmail: string
  contactAddress: string
  sections: {
    [key: string]: PrivacySection
  }
}

export interface PrivacyPolicyDataMap {
  [countryCode: string]: PrivacyPolicyData
}

export const privacyPolicyData: PrivacyPolicyDataMap = {
  us: {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    lastUpdated: "December 2024",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, San Francisco, CA 94103, United States",
    sections: {
      "information-we-collect": {
        title: "Information We Collect",
        content: [
          "When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.",
          "When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number."
        ],
        subsections: [
          {
            title: "Personal Information",
            content: [
              "We collect personal information that you voluntarily provide to us when you register for an account, make a purchase, or contact us for support."
            ]
          },
          {
            title: "Device Information",
            content: [
              "We collect device information using the following technologies:"
            ],
            listItems: [
              "Cookies are data files that are placed on your device or computer and often include an anonymous unique identifier.",
              "Log files track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.",
              "Web beacons, tags, and pixels are electronic files used to record information about how you browse the Site."
            ]
          }
        ]
      },
      "how-we-use-information": {
        title: "How We Use Your Information",
        content: [
          "We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations)."
        ],
        subsections: [
          {
            title: "Order Processing",
            content: [
              "Additionally, we use this Order Information to:"
            ],
            listItems: [
              "Communicate with you about your order",
              "Screen our orders for potential risk or fraud",
              "Provide you with information or advertising relating to our products or services",
              "Improve and optimize our store and customer experience"
            ]
          }
        ]
      },
      "sharing-your-information": {
        title: "Sharing Your Information",
        content: [
          "We share your Personal Information with third parties to help us use your Personal Information, as described above.",
          "We use Google Analytics to help us understand how our customers use the Site. You can read more about how Google uses your Personal Information here: https://www.google.com/intl/en/policies/privacy/.",
          "We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights."
        ]
      },
      "cookies": {
        title: "Cookies and Tracking Technologies",
        content: [
          "Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect certain features or services of our Site.",
          "We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place."
        ]
      },
      "data-retention": {
        title: "Data Retention",
        content: [
          "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information. We store your Personal Information for as long as needed to provide you with our services and to comply with our legal obligations."
        ]
      },
      "your-rights": {
        title: "Your Rights",
        content: [
          "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.",
          "Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you, or otherwise to pursue our legitimate business interests listed above.",
          "For California residents, the California Consumer Privacy Act (CCPA) provides additional rights regarding personal information. To learn more about your California privacy rights, visit our CCPA Privacy Notice for California Residents."
        ]
      },
      "childrens-privacy": {
        title: "Children's Privacy",
        content: [
          "Our Site is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions."
        ]
      },
      "changes": {
        title: "Changes to This Privacy Policy",
        content: [
          "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons. We will notify you of any changes by posting the new privacy policy on this page and updating the 'Last Updated' date at the top of this page."
        ]
      },
      "contact-us": {
        title: "Contact Us",
        content: [
          "For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at info@fineystjackets.com or by mail using the details provided below:"
        ]
      }
    }
  },

  uk: {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information in accordance with UK GDPR",
    lastUpdated: "December 2024",
    contactEmail: "privacy@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, London, UK SW1A 1AA",
    sections: {
      "information-we-collect": {
        title: "Information We Collect",
        content: [
          "Under the UK General Data Protection Regulation (UK GDPR), we are required to inform you about the personal data we collect and process. When you visit our Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.",
          "When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number."
        ],
        subsections: [
          {
            title: "Legal Basis for Processing",
            content: [
              "We process your personal data under the following legal bases:"
            ],
            listItems: [
              "Consent - where you have given clear consent for us to process your personal data for a specific purpose",
              "Contract - where processing is necessary for the performance of a contract with you",
              "Legal obligation - where processing is necessary for compliance with a legal obligation",
              "Legitimate interests - where processing is necessary for our legitimate interests or those of a third party"
            ]
          }
        ]
      },
      "how-we-use-information": {
        title: "How We Use Your Information",
        content: [
          "We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations)."
        ],
        subsections: [
          {
            title: "Data Processing Purposes",
            content: [
              "We process your personal data for the following purposes:"
            ],
            listItems: [
              "Order fulfillment and customer service",
              "Fraud prevention and security",
              "Marketing communications (with your consent)",
              "Website analytics and improvement",
              "Legal compliance"
            ]
          }
        ]
      },
      "sharing-your-information": {
        title: "Sharing Your Information",
        content: [
          "We may share your personal data with third parties only in the following circumstances:",
          "Service providers who assist us in operating our website and conducting our business (under strict data protection agreements)",
          "Legal authorities when required by law or to protect our rights",
          "Business transfers in the event of a merger or acquisition"
        ]
      },
      "cookies": {
        title: "Cookies and Tracking Technologies",
        content: [
          "We use cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.",
          "We only use essential cookies without your consent. For non-essential cookies, we will request your consent before setting them."
        ]
      },
      "data-retention": {
        title: "Data Retention",
        content: [
          "We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.",
          "Generally, we retain order information for 7 years for accounting purposes, and marketing data until you withdraw consent."
        ]
      },
      "your-rights": {
        title: "Your Rights Under UK GDPR",
        content: [
          "Under UK GDPR, you have the following rights regarding your personal data:"
        ],
        subsections: [
          {
            title: "Your Data Protection Rights",
            content: [],
            listItems: [
              "Right of access - You have the right to request copies of your personal data",
              "Right to rectification - You have the right to request correction of inaccurate data",
              "Right to erasure - You have the right to request deletion of your personal data",
              "Right to restrict processing - You have the right to request restriction of processing",
              "Right to data portability - You have the right to request transfer of your data",
              "Right to object - You have the right to object to processing of your personal data",
              "Rights related to automated decision making - You have rights regarding automated decisions"
            ]
          }
        ]
      },
      "childrens-privacy": {
        title: "Children's Privacy",
        content: [
          "Our Site is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions."
        ]
      },
      "changes": {
        title: "Changes to This Privacy Policy",
        content: [
          "We may update this privacy policy from time to time. We will notify you of any material changes by email or through a notice on our website. The updated policy will be effective immediately upon posting."
        ]
      },
      "contact-us": {
        title: "Contact Us",
        content: [
          "For any questions about this privacy policy or to exercise your data protection rights, please contact us:",
          "Data Protection Officer: privacy@fineystjackets.com",
          "Address: 123 Fashion Avenue, Suite 500, London, UK SW1A 1AA"
        ]
      }
    }
  },

  ca: {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information in accordance with Canadian privacy laws",
    lastUpdated: "December 2024",
    contactEmail: "privacy@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Toronto, ON M5H 2N2, Canada",
    sections: {
      "information-we-collect": {
        title: "Information We Collect",
        content: [
          "In accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA), we collect personal information that is necessary for our business operations and to provide you with our services.",
          "We collect information when you visit our website, make a purchase, create an account, or contact us for support."
        ]
      },
      "how-we-use-information": {
        title: "How We Use Your Information",
        content: [
          "We use your personal information to process orders, provide customer service, improve our website, and communicate with you about our products and services."
        ]
      },
      "sharing-your-information": {
        title: "Sharing Your Information",
        content: [
          "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law."
        ]
      },
      "cookies": {
        title: "Cookies and Tracking Technologies",
        content: [
          "We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences."
        ]
      },
      "data-retention": {
        title: "Data Retention",
        content: [
          "We retain your personal information only as long as necessary to fulfill the purposes for which it was collected or as required by law."
        ]
      },
      "your-rights": {
        title: "Your Privacy Rights",
        content: [
          "Under Canadian privacy laws, you have the right to access, correct, or delete your personal information. You may also withdraw your consent for certain uses of your information."
        ]
      },
      "childrens-privacy": {
        title: "Children's Privacy",
        content: [
          "We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
        ]
      },
      "changes": {
        title: "Changes to This Privacy Policy",
        content: [
          "We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on our website."
        ]
      },
      "contact-us": {
        title: "Contact Us",
        content: [
          "For questions about this privacy policy or to exercise your privacy rights, please contact us:",
          "Privacy Officer: privacy@fineystjackets.com",
          "Address: 123 Fashion Avenue, Suite 500, Toronto, ON M5H 2N2, Canada"
        ]
      }
    }
  },

  au: {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information in accordance with Australian Privacy Principles",
    lastUpdated: "December 2024",
    contactEmail: "privacy@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Sydney, NSW 2000, Australia",
    sections: {
      "information-we-collect": {
        title: "Information We Collect",
        content: [
          "In accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles, we collect personal information that is reasonably necessary for our business functions and activities.",
          "We collect information when you visit our website, make a purchase, create an account, or contact us for support."
        ]
      },
      "how-we-use-information": {
        title: "How We Use Your Information",
        content: [
          "We use your personal information to process orders, provide customer service, improve our website, and communicate with you about our products and services."
        ]
      },
      "sharing-your-information": {
        title: "Sharing Your Information",
        content: [
          "We may share your personal information with third parties only when necessary for our business operations or as required by law. We ensure all third parties comply with Australian privacy laws."
        ]
      },
      "cookies": {
        title: "Cookies and Tracking Technologies",
        content: [
          "We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences."
        ]
      },
      "data-retention": {
        title: "Data Retention",
        content: [
          "We retain your personal information only as long as necessary to fulfill the purposes for which it was collected or as required by law."
        ]
      },
      "your-rights": {
        title: "Your Privacy Rights",
        content: [
          "Under Australian privacy laws, you have the right to access, correct, or delete your personal information. You may also make a complaint to the Office of the Australian Information Commissioner (OAIC)."
        ]
      },
      "childrens-privacy": {
        title: "Children's Privacy",
        content: [
          "We do not knowingly collect personal information from children under 18 without parental consent. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
        ]
      },
      "changes": {
        title: "Changes to This Privacy Policy",
        content: [
          "We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on our website."
        ]
      },
      "contact-us": {
        title: "Contact Us",
        content: [
          "For questions about this privacy policy or to exercise your privacy rights, please contact us:",
          "Privacy Officer: privacy@fineystjackets.com",
          "Address: 123 Fashion Avenue, Suite 500, Sydney, NSW 2000, Australia"
        ]
      }
    }
  }
}

export function getPrivacyPolicyData(countryCode: string) {
  const normalizedCountryCode = countryCode.toLowerCase()
  
  return privacyPolicyData[normalizedCountryCode] || privacyPolicyData.us
}

export function getAvailableCountryCodes(): string[] {
  return Object.keys(privacyPolicyData)
}
