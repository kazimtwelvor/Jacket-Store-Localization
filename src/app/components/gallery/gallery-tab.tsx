"use client"

import type React from "react"

import Image from "next/image"
import { Tab } from "@headlessui/react"
import { cn } from "../../lib/utils"
import type { ProductImage } from "@/types"

interface GalleryTabProps {
  image: ProductImage
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white">
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <Image
              fill
              src={image.image.url}
              alt={image.image.altText || "Gallery image"}
              className="object-cover object-center"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-black" : "ring-transparent",
            )}
          />
        </div>
      )}
    </Tab>
  )
}

export default GalleryTab
