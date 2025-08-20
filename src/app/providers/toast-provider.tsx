"use client"

import { Toaster } from "react-hot-toast"

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e2e8f0",
            padding: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "0.5rem",
          },
        },
        error: {
          style: {
            background: "#fff",
            color: "#000000",
            border: "1px solid #e2e8f0",
          },
        },
      }}
    />
  )
}

export default ToastProvider
