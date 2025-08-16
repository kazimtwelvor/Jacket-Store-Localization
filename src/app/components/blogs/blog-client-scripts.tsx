"use client"

import { useEffect } from "react"

export default function BlogClientScripts() {
  useEffect(() => {
    const updateReadingProgress = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
      const progressBar = document.getElementById("reading-progress-bar")
      if (progressBar) {
        progressBar.style.width = `${progress}%`
      }
    }

    const updateBackToTopButton = () => {
      const backToTopButton = document.getElementById("back-to-top")
      if (backToTopButton) {
        if (window.scrollY > 300) {
          backToTopButton.classList.add("visible")
        } else {
          backToTopButton.classList.remove("visible")
        }
      }
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    window.addEventListener("scroll", updateReadingProgress)
    window.addEventListener("scroll", updateBackToTopButton)

    const backToTopButton = document.getElementById("back-to-top")
    if (backToTopButton) {
      backToTopButton.addEventListener("click", scrollToTop)
    }

    updateReadingProgress()
    updateBackToTopButton()

    return () => {
      window.removeEventListener("scroll", updateReadingProgress)
      window.removeEventListener("scroll", updateBackToTopButton)
      if (backToTopButton) {
        backToTopButton.removeEventListener("click", scrollToTop)
      }
    }
  }, [])

  return null
}
