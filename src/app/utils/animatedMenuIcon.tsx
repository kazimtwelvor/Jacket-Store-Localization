"use client"

import { motion } from "framer-motion"

interface AnimatedMenuIconProps {
  isOpen: boolean
  onClick: () => void
  className?: string
  color?: string
}

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2.5"
    stroke={props.color || "currentColor"}
    strokeLinecap="round"
    {...props}
  />
)

const AnimatedMenuIcon: React.FC<AnimatedMenuIconProps> = ({ isOpen, onClick, className, color = "white" }) => {
  return (
    <button onClick={onClick} className={className} aria-label={isOpen ? "Close menu" : "Open menu"}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <Path
          color={color}
          variants={{
            closed: { d: "M 2 5 L 22 5" },
            open: { d: "M 4 19 L 20 5" }
          }}
          initial={false}
          animate={isOpen ? "open" : "closed"}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <Path
          color={color}
          d="M 2 12 L 22 12"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 }
          }}
          initial={false}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.1 }}
        />
        <Path
          color={color}
          variants={{
            closed: { d: "M 2 19 L 22 19" },
            open: { d: "M 4 5 L 20 19" }
          }}
          initial={false}
          animate={isOpen ? "open" : "closed"}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      </svg>
    </button>
  )
}

export default AnimatedMenuIcon
