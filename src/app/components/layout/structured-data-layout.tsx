import React from 'react'

interface StructuredDataProps {
  data: any[]
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}

export default StructuredData