"use client"

import React from 'react'

interface HtmlRendererProps {
  content: string
  className?: string
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, className = '' }) => {
  if (!content) return null

  // Clean and sanitize the HTML content
  const cleanContent = content
    .replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => 
      String.fromCharCode(parseInt(code, 16))
    )
    .trim()

  return (
    <div 
      className={`prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
      style={{
        // Custom styles for better HTML rendering
        lineHeight: '1.6',
      }}
    />
  )
}

export default HtmlRenderer