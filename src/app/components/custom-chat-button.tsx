"use client"

import { useState } from "react"

declare global {
  interface Window {
    tidioChatApi?: {
      open: () => void
      on: (event: string, callback: () => void) => void
    }
  }
}

export default function CustomChatButton() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const loadTidio = () => {
    if (isLoaded) return

    const script = document.createElement("script")
    script.src = "//code.tidio.co/q6emt8wa6kvfi6bjfn8wyfkmv9q7xrl5.js"
    script.async = true
    script.defer = true
    script.id = "tidio-script"

    script.onload = () => {
      setIsLoaded(true)

      // Open the widget after Tidio is ready (non-mobile only)
      const isMobile = () => {
        try {
          return !!(
            navigator.userAgent &&
            /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          )
        } catch (e) {
          return false
        }
      }

      const onTidioChatApiReady = () => {
        if (!isMobile() && window.tidioChatApi) {
          window.tidioChatApi.open()
        }
      }

      if (window.tidioChatApi) {
        window.tidioChatApi.on("ready", onTidioChatApiReady)
      } else {
        document.addEventListener("tidioChat-ready", onTidioChatApiReady)
      }

      // Hide the button after 1 second
      setTimeout(() => {
        setIsVisible(false)
      }, 1000)
    }

    document.body.appendChild(script)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Custom CSS for Tidio button styling */}
      <style jsx global>{`
        #button.sidebar .sidebar-content {
          background: rgb(49, 63, 160);
          color: rgb(255, 255, 255);
          padding: 0px 10px 0px 10px;
          font-size: 13px;
          line-height: 20px;
          height: 20px;
          font-weight: 700;
          overflow: hidden;
          border-bottom-left-radius: 4px;
          transform: rotate(90deg);
          transform-origin: right top;
          position: absolute;
          bottom: 0px;
          right: 0px;
          white-space: nowrap;
          max-width: 400px;
        }
      `}</style>
      
      <div
        style={{
          height: "auto",
          position: "fixed",
          right: 15,
          bottom: "35%",
          zIndex: 22,
          borderRadius: "0px"
        }}
      >
        <button
          onClick={loadTidio}
          className="text-xs sm:text-sm md:text-base no-capsule"
          style={{
            color: "#FFFFFF",
            textDecoration: "none",
            background: "linear-gradient(90deg, #000000 0%, #000000 100%)",
            padding: "5px 12px 35px",
            display: "block",
            fontWeight: "bold",
            borderRadius: "0px",
            transform: "rotate(-90deg) translate(0, -20px)",
            position: "relative",
            right: "-85px",
            transition: "right 0.2s ease",
            border: "none",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.right = "-65px"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.right = "-85px"
          }}
        >
          CHAT NOW
        </button>
      </div>
    </>
  )
}