
"use client"

import { useState, useEffect } from "react"
import { useSizeGuideContext } from "./size-guide-context"

interface SizeGuideTableProps {
  headers: string[]
  data: string[][]
}

export default function SizeGuideTable({ headers, data }: SizeGuideTableProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { unit } = useSizeGuideContext()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <table className="min-w-full divide-y divide-border">
      <thead>
        <tr className="bg-muted/50">
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {data.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`px-6 py-4 whitespace-nowrap text-sm ${
                  cellIndex === 0 ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
