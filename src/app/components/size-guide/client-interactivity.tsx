"use client"

import { useEffect } from "react"

export default function ClientInteractivity() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")?.substring(1)
        const targetElement = document.getElementById(targetId || "")

        if (targetElement) {
          const yOffset = -120
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }
    }

    const updateActiveNavItem = () => {
      const sections = document.querySelectorAll("section[id]")
      const navItems = document.querySelectorAll(".nav-item")

      let currentSectionId = ""

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop < 200) {
          currentSectionId = section.id
        }
      })

      navItems.forEach((item) => {
        item.classList.remove("active-nav-item", "bg-primary/10", "text-primary")
        item.classList.add("text-muted-foreground")

        const href = item.getAttribute("href")
        if (href === `#${currentSectionId}`) {
          item.classList.add("active-nav-item", "bg-primary/10", "text-primary")
          item.classList.remove("text-muted-foreground")
        }
      })
    }

    const handlePrintClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-print-button]")) {
        e.preventDefault()
        window.print()
      }
    }

    const handleFaqToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const faqQuestion = target.closest(".faq-question")

      if (faqQuestion) {
        const faqItem = faqQuestion.closest(".faq-item")
        const faqAnswer = faqItem?.querySelector(".faq-answer")
        const plusIcon = faqQuestion.querySelector(".plus-icon")

        if (faqAnswer && plusIcon) {
          const isExpanded = faqQuestion.getAttribute("aria-expanded") === "true"

          faqQuestion.setAttribute("aria-expanded", isExpanded ? "false" : "true")
          faqAnswer.classList.toggle("hidden", isExpanded)

          if (isExpanded) {
            plusIcon.innerHTML = '<path d="M12 5v14M5 12h14"></path>'
          } else {
            plusIcon.innerHTML = '<path d="M5 12h14M12 5v14"></path>'
          }
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)
    document.addEventListener("click", handlePrintClick)
    document.addEventListener("click", handleFaqToggle)
    window.addEventListener("scroll", updateActiveNavItem)

    updateActiveNavItem()

    return () => {
      document.removeEventListener("click", handleAnchorClick)
      document.removeEventListener("click", handlePrintClick)
      document.removeEventListener("click", handleFaqToggle)
      window.removeEventListener("scroll", updateActiveNavItem)
    }
  }, [])

  return null
}
