
"use client"

import { useEffect, useState } from "react"

export function BgGridPattern() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
                    backgroundSize: `40px 40px`,
                }}
            />
        )
    }

    return (
        <div
            className="absolute inset-0 opacity-10"
            style={{
                backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: `40px 40px`,
            }}
        />
    )
}
