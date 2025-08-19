"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/app/ui/dialog"

interface Category {
  title: string;
  icon: React.ReactNode;
  description: string;
  onSelect: () => void;
}

interface WhatsMySizeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Category[];
  onCategorySelect?: (category: string) => void;
}

const defaultCategories = [
  {
    title: "Tops",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
      </svg>
    ),
    description: "Size recommendations for shirts, coats, jackets, etc",
  },
  {
    title: "Pants",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 13h10v8H7z"></path>
        <path d="M7 13h10"></path>
        <path d="M7 13 4 3h16l-3 10"></path>
      </svg>
    ),
    description: "Size recommendations for pants, shorts, etc",
  },
  {
    title: "Footwear",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 14h20"></path>
        <path d="M2 14c0 2.5 2 4 5 4h11c2 0 4-1 4-3.5S20.2 10 19 9c-1-1-4-1-4-1s-1-1-2.5-1c-1 0-2 0-3.5.5-2 .5-3.5 2-4.5 3.5-1.7 2.5-2.5 3-2.5 3Z"></path>
      </svg>
    ),
    description: "Size recommendations for shoes",
  },
];

export default function WhatsMySize({
  open,
  onOpenChange,
  categories = defaultCategories,
  onCategorySelect,
}: WhatsMySizeProps) {
  const handleCategorySelect = (category: string) => {
    onCategorySelect?.(category);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] z-[9999]"
        style={{ zIndex: 9999 }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="text-xl pl-5 font-bold">FINEYST</div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"></path>
                <path d="M16 8h.01"></path>
                <path d="M8 16l8-8"></path>
              </svg>
              <span className="text-base font-medium">FIT FINDER</span>
            </div>
            <button className="text-sm pr-9 text-gray-600 hover:underline">
              Privacy
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <motion.h2
            className="text-xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Find your best fits
          </motion.h2>
          <motion.p
            className="text-center text-sm mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Receive size recommendations by entering your data for each category
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="border rounded-md p-4 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className="flex flex-col flex-grow items-center text-center">
                  <motion.div className="mb-2" whileHover={{ rotate: 5 }}>
                    {category.icon}
                  </motion.div>
                  <h3 className="font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                </div>
                <motion.button
                  className="bg-black text-white hover:bg-gray-800 w-full py-2 rounded flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCategorySelect(category.title)}
                >
                  Select
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
