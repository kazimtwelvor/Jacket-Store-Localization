"use client"

import React from 'react'

interface HtmlRendererProps {
  content: string
  className?: string
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, className = '' }) => {
  console.log('HtmlRenderer called with content:', content)
  
  if (!content) {
    console.log('No content provided')
    return null
  }

  // Simple HTML entity decoding
  const cleanContent = content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .trim()

  console.log('Cleaned content:', cleanContent)

  const styledContent = `
    <style>
      .html-content { font-size: 1rem; line-height: 1.6; color: #374151; white-space: normal; }
      .html-content p { margin-bottom: 1rem; display: inline; }
      .html-content h1, .html-content h2, .html-content h3, .html-content h4 { font-size: 1rem; font-weight: bold; margin: 0; color: #111827; display: inline; }
    </style>
    <div class="html-content">${cleanContent}</div>
  `

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: styledContent }}
      style={{
        padding: '10px',
        backgroundColor: '#f0f0f0'
      }}
    />
  )
}

export default HtmlRenderer