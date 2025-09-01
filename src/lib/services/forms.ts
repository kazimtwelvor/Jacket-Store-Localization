const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  agreeToPrivacyPolicy: boolean
}

export interface NewsletterFormData {
  email: string
}

export const submitContactForm = async (formData: ContactFormData) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!baseUrl) throw new Error('API URL not configured')
  
  const response = await fetch(`${baseUrl}/forms/contact-forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit contact form')
  }

  return response.json()
}

export const submitNewsletterForm = async (email: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!baseUrl) throw new Error('API URL not configured')
  
  const response = await fetch(`${baseUrl}/forms/newsletter-forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to subscribe to newsletter')
  }

  return response.json()
}