"use client"

import { OptimizedBackgroundImageProps } from "./types"

export const OptimizedBackgroundImage = ({
    image,
    className = "",
    priority = false
}: OptimizedBackgroundImageProps) => {
    return (
        <section
            className={`absolute inset-0 ${className}`}
            style={{
                backgroundImage: `url('${image.src}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            role="img"
            aria-label={image.alt}
            data-priority={priority}
        />
    )
}
