export interface ContactMethod {
  icon: string
  title: string
  description: string
  contact: string
  link?: string
  hours?: string
}

export interface ContactFeature {
  icon: string
  title: string
  description: string
  metric: string
  metricValue: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface ContactData {
  title: string
  description: string
  heroFeatures: string[]
  contactMethods: ContactMethod[]
  supportFeatures: ContactFeature[]
  socialLinks: SocialLink[]
  supportHours: string
  email: string
  phone: string
  address: string
}

export interface ContactDataMap {
  [countryCode: string]: ContactData
}

const usContactData: ContactData = {
  title: "Get In Touch",
  description: "We'd love to hear from you. Our team is always here to help.",
  heroFeatures: ["24/7 Support", "Quick Response", "Expert Help", "Multiple Channels"],
  contactMethods: [
    {
      icon: "Mail",
      title: "Email Us",
      description: "",
      contact: "info@fineystjackets.com",
      link: "mailto:info@fineystjackets.com"
    },
    {
      icon: "Phone",
      title: "Call Us",
      description: "",
      contact: "+1 (888) 840-0885",
      link: "tel:+18888400885"
    },
    {
      icon: "MessageSquare",
      title: "Live Chat",
      description: "Available Monday - Friday",
      contact: "9:00 AM - 6:00 PM CST",
      link: "#",
      hours: "Start a chat now"
    },
    {
      icon: "Clock",
      title: "Support Hours",
      description: "Monday - Friday: 9:00 AM - 6:00 PM CST",
      contact: "Saturday: 10:00 AM - 4:00 PM CST",
      hours: "Sunday: Closed"
    }
  ],
  supportFeatures: [
    {
      icon: "HeadphonesIcon",
      title: "24/7 Support",
      description: "Our dedicated team is available around the clock to assist you with any questions or concerns.",
      metric: "Average response time:",
      metricValue: "Under 2 hours"
    },
    {
      icon: "ShieldCheck",
      title: "Satisfaction Guarantee",
      description: "Not happy with your purchase? Our hassle-free return policy ensures your complete satisfaction.",
      metric: "Return window:",
      metricValue: "30 days"
    },
    {
      icon: "Clock8",
      title: "Fast Resolution",
      description: "We pride ourselves on quick issue resolution and personalized attention to every customer inquiry.",
      metric: "Resolution rate:",
      metricValue: "95% within 24 hours"
    }
  ],
  socialLinks: [
    {
      platform: "Instagram",
      url: "https://www.instagram.com/fineystjackets/",
      icon: "Instagram"
    },
    {
      platform: "Twitter",
      url: "https://x.com/fineystjackets",
      icon: "Twitter"
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/fineystjackets",
      icon: "Facebook"
    },
    {
      platform: "Pinterest",
      url: "https://www.pinterest.com/fineystjackets/",
      icon: "Pinterest"
    }
  ],
  supportHours: "Monday - Friday: 9:00 AM - 6:00 PM CST",
  email: "info@fineystjackets.com",
  phone: "+1 (888) 840-0885",
  address: "123 Fashion Avenue, Suite 500, San Francisco, CA 94103, United States"
}

const ukContactData: ContactData = {
  title: "Get In Touch",
  description: "We'd love to hear from you. Our team is always here to help (UK).",
  heroFeatures: ["24/7 Support", "Quick Response", "Expert Help", "Multiple Channels"],
  contactMethods: [
    {
      icon: "Mail",
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "info@fineystjackets.com",
      link: "mailto:info@fineystjackets.com"
    },
    {
      icon: "Phone",
      title: "Call Us",
      description: "Available Mon-Fri, 9am-5pm GMT",
      contact: "+44 (0) 20 7946 0958",
      link: "tel:+442079460958"
    },
    {
      icon: "MessageSquare",
      title: "Live Chat",
      description: "Available Monday - Friday",
      contact: "9:00 AM - 6:00 PM GMT",
      link: "#",
      hours: "Start a chat now"
    },
    {
      icon: "Clock",
      title: "Support Hours",
      description: "Monday - Friday: 9:00 AM - 6:00 PM GMT",
      contact: "Saturday: 10:00 AM - 4:00 PM GMT",
      hours: "Sunday: Closed"
    }
  ],
  supportFeatures: [
    {
      icon: "HeadphonesIcon",
      title: "24/7 Support",
      description: "Our dedicated team is available around the clock to assist you with any questions or concerns.",
      metric: "Average response time:",
      metricValue: "Under 2 hours"
    },
    {
      icon: "ShieldCheck",
      title: "Satisfaction Guarantee",
      description: "Not happy with your purchase? Our hassle-free return policy ensures your complete satisfaction.",
      metric: "Return window:",
      metricValue: "30 days"
    },
    {
      icon: "Clock8",
      title: "Fast Resolution",
      description: "We pride ourselves on quick issue resolution and personalized attention to every customer inquiry.",
      metric: "Resolution rate:",
      metricValue: "95% within 24 hours"
    }
  ],
  socialLinks: [
    {
      platform: "Instagram",
      url: "https://www.instagram.com/fineystjackets/",
      icon: "Instagram"
    },
    {
      platform: "Twitter",
      url: "https://x.com/fineystjackets",
      icon: "Twitter"
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/fineystjackets",
      icon: "Facebook"
    },
    {
      platform: "Pinterest",
      url: "https://www.pinterest.com/fineystjackets/",
      icon: "Pinterest"
    }
  ],
  supportHours: "Monday - Friday: 9:00 AM - 6:00 PM GMT",
  email: "info@fineystjackets.com",
  phone: "+44 (0) 20 7946 0958",
  address: "123 Fashion Avenue, Suite 500, London, UK SW1A 1AA"
}

const caContactData: ContactData = {
  title: "Get In Touch",
  description: "We'd love to hear from you. Our team is always here to help.",
  heroFeatures: ["24/7 Support", "Quick Response", "Expert Help", "Multiple Channels"],
  contactMethods: [
    {
      icon: "Mail",
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "info@fineystjackets.com",
      link: "mailto:info@fineystjackets.com"
    },
    {
      icon: "Phone",
      title: "Call Us",
      description: "Available Mon-Fri, 9am-5pm EST",
      contact: "+1 (416) 555-0123",
      link: "tel:+14165550123"
    },
    {
      icon: "MessageSquare",
      title: "Live Chat",
      description: "Available Monday - Friday",
      contact: "9:00 AM - 6:00 PM EST",
      link: "#",
      hours: "Start a chat now"
    },
    {
      icon: "Clock",
      title: "Support Hours",
      description: "Monday - Friday: 9:00 AM - 6:00 PM EST",
      contact: "Saturday: 10:00 AM - 4:00 PM EST",
      hours: "Sunday: Closed"
    }
  ],
  supportFeatures: [
    {
      icon: "HeadphonesIcon",
      title: "24/7 Support",
      description: "Our dedicated team is available around the clock to assist you with any questions or concerns.",
      metric: "Average response time:",
      metricValue: "Under 2 hours"
    },
    {
      icon: "ShieldCheck",
      title: "Satisfaction Guarantee",
      description: "Not happy with your purchase? Our hassle-free return policy ensures your complete satisfaction.",
      metric: "Return window:",
      metricValue: "30 days"
    },
    {
      icon: "Clock8",
      title: "Fast Resolution",
      description: "We pride ourselves on quick issue resolution and personalized attention to every customer inquiry.",
      metric: "Resolution rate:",
      metricValue: "95% within 24 hours"
    }
  ],
  socialLinks: [
    {
      platform: "Instagram",
      url: "https://www.instagram.com/fineystjackets/",
      icon: "Instagram"
    },
    {
      platform: "Twitter",
      url: "https://x.com/fineystjackets",
      icon: "Twitter"
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/fineystjackets",
      icon: "Facebook"
    },
    {
      platform: "Pinterest",
      url: "https://www.pinterest.com/fineystjackets/",
      icon: "Pinterest"
    }
  ],
  supportHours: "Monday - Friday: 9:00 AM - 6:00 PM EST",
  email: "info@fineystjackets.com",
  phone: "+1 (416) 555-0123",
  address: "123 Fashion Avenue, Suite 500, Toronto, ON M5H 2N2, Canada"
}

const auContactData: ContactData = {
  title: "Get In Touch",
  description: "We'd love to hear from you. Our team is always here to help.",
  heroFeatures: ["24/7 Support", "Quick Response", "Expert Help", "Multiple Channels"],
  contactMethods: [
    {
      icon: "Mail",
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "info@fineystjackets.com",
      link: "mailto:info@fineystjackets.com"
    },
    {
      icon: "Phone",
      title: "Call Us",
      description: "Available Mon-Fri, 9am-5pm AEST",
      contact: "+61 2 5555 0123",
      link: "tel:+61255550123"
    },
    {
      icon: "MessageSquare",
      title: "Live Chat",
      description: "Available Monday - Friday",
      contact: "9:00 AM - 6:00 PM AEST",
      link: "#",
      hours: "Start a chat now"
    },
    {
      icon: "Clock",
      title: "Support Hours",
      description: "Monday - Friday: 9:00 AM - 6:00 PM AEST",
      contact: "Saturday: 10:00 AM - 4:00 PM AEST",
      hours: "Sunday: Closed"
    }
  ],
  supportFeatures: [
    {
      icon: "HeadphonesIcon",
      title: "24/7 Support",
      description: "Our dedicated team is available around the clock to assist you with any questions or concerns.",
      metric: "Average response time:",
      metricValue: "Under 2 hours"
    },
    {
      icon: "ShieldCheck",
      title: "Satisfaction Guarantee",
      description: "Not happy with your purchase? Our hassle-free return policy ensures your complete satisfaction.",
      metric: "Return window:",
      metricValue: "30 days"
    },
    {
      icon: "Clock8",
      title: "Fast Resolution",
      description: "We pride ourselves on quick issue resolution and personalized attention to every customer inquiry.",
      metric: "Resolution rate:",
      metricValue: "95% within 24 hours"
    }
  ],
  socialLinks: [
    {
      platform: "Instagram",
      url: "https://www.instagram.com/fineystjackets/",
      icon: "Instagram"
    },
    {
      platform: "Twitter",
      url: "https://x.com/fineystjackets",
      icon: "Twitter"
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/fineystjackets",
      icon: "Facebook"
    },
    {
      platform: "Pinterest",
      url: "https://www.pinterest.com/fineystjackets/",
      icon: "Pinterest"
    }
  ],
  supportHours: "Monday - Friday: 9:00 AM - 6:00 PM AEST",
  email: "info@fineystjackets.com",
  phone: "+61 2 5555 0123",
  address: "123 Fashion Avenue, Suite 500, Sydney, NSW 2000, Australia"
}

export const contactDataByCountry: ContactDataMap = {
  us: usContactData,
  uk: ukContactData,
  ca: caContactData,
  au: auContactData,
}

export function getContactData(countryCode: string): ContactData {
  const normalizedCountryCode = countryCode.toLowerCase()
  return contactDataByCountry[normalizedCountryCode] || contactDataByCountry.us
}

export function getAvailableContactCountryCodes(): string[] {
  return Object.keys(contactDataByCountry)
}
