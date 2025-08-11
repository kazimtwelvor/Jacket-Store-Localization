"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface SidebarContextProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-transform duration-300 md:relative",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className={cn("md:hidden", className)} onClick={toggleSidebar} {...props}>
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { toggleSidebar } = useSidebar()

  return (
    <div className={cn("flex h-14 items-center border-b px-4", className)} {...props}>
      <div className="flex flex-1 items-center gap-2">{children}</div>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <X className="h-5 w-5" />
        <span className="sr-only">Close sidebar</span>
      </Button>
    </div>
  )
}

export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 py-2 text-sm font-semibold", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  )
}

export function SidebarMenuButton({
  className,
  children,
  isActive,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean
  asChild?: boolean
}) {
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      className={cn(
        "flex w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-foreground",
        isActive && "bg-muted text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function SidebarRail({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 top-0 w-1 bg-border opacity-0 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarInset({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={cn("flex flex-1 flex-col md:ml-[260px]", isOpen ? "md:ml-[260px]" : "md:ml-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}
