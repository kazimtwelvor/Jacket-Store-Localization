"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/src/app/ui/button"
import { submitContactForm, type ContactFormData } from "@/src/lib/services/forms"

export default function ContactForm() {
  
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    agreeToPrivacyPolicy: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      await submitContactForm(formData)
      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
        agreeToPrivacyPolicy: false
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-none border-b border border-black shadow-lg">
      <h2 className="text-3xl text-[#2b2b2b] font-bold mb-6">Send Us a Message</h2>
      <p className="text-black mb-8">
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md border border-input bg-background"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md border border-input bg-background"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-md border border-input bg-background"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-md border border-input bg-background"
            placeholder="How can we help you?"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-3 rounded-md border border-input bg-background resize-none"
            placeholder="Tell us more about your inquiry..."
            required
          ></textarea>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="privacy"
            name="agreeToPrivacyPolicy"
            checked={formData.agreeToPrivacyPolicy}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            required
          />
          <label htmlFor="privacy" className="ml-2 block text-sm text-muted-foreground">
            I agree to the{" "}
            <Link href="/privacy-policy" className="text-[#2b2b2b] hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-[#EAEAEA] hover:bg-[#EAEAEA]/90 text-black rounded-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  )
}