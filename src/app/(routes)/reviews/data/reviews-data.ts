export interface Review {
  id: string
  name: string
  avatar?: string
  date: string
  rating: number
  title: string
  comment: string
  category: string
  productName?: string
  image?: string
  likes: number
  replies: number
  featured?: boolean
  verified?: boolean
}

export const categories = ["Clothing", "Accessories", "Footwear", "Outerwear", "New Arrivals"]

export const reviews: Review[] = [
  {
    id: "1",
    name: "Emma Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "March 15, 2023",
    rating: 5,
    title: "Absolutely love this t-shirt!",
    comment:
      "This t-shirt exceeded all my expectations! The fabric is incredibly soft and comfortable, and the fit is perfect. I've received so many compliments when wearing it. The color is exactly as shown in the pictures, and it hasn't faded even after multiple washes. I'm definitely buying more in different colors!",
    category: "Clothing",
    productName: "Premium Cotton T-Shirt",
    image: "/placeholder.svg?height=400&width=300",
    likes: 42,
    replies: 5,
    featured: true,
    verified: true,
  },
  {
    id: "2",
    name: "Michael Smith",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "April 3, 2023",
    rating: 4,
    title: "Great quality jacket",
    comment:
      "This jacket is perfect for fall weather. The quality is excellent and it looks even better in person. The only reason I'm giving 4 stars instead of 5 is that it runs slightly large. I would recommend sizing down if you prefer a more fitted look.",
    category: "Outerwear",
    productName: "Waterproof Hiking Jacket",
    image: "/placeholder.svg?height=400&width=300",
    likes: 28,
    replies: 3,
    verified: true,
  },
  {
    id: "3",
    name: "Sophia Williams",
    date: "February 22, 2023",
    rating: 5,
    title: "Perfect everyday bag",
    comment:
      "I've been using this bag daily for the past month and it's holding up beautifully. The leather is high quality and the design is both functional and stylish. It fits all my essentials and the interior pockets help keep everything organized.",
    category: "Accessories",
    productName: "Leather Crossbody Bag",
    image: "/placeholder.svg?height=400&width=300",
    likes: 56,
    replies: 8,
    featured: true,
  },
  {
    id: "4",
    name: "James Brown",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "May 10, 2023",
    rating: 3,
    title: "Decent shoes but sizing issues",
    comment:
      "The shoes look great and the material seems durable, but they run at least a half size smaller than expected. I should have ordered a size up. The comfort level is good once you get the right size though.",
    category: "Footwear",
    productName: "Urban Sneakers",
    image: "/placeholder.svg?height=400&width=300",
    likes: 15,
    replies: 7,
  },
  {
    id: "5",
    name: "Olivia Davis",
    date: "January 8, 2023",
    rating: 5,
    title: "Best winter coat ever!",
    comment:
      "This coat is incredibly warm yet lightweight. I've worn it in below freezing temperatures and stayed perfectly comfortable. The hood is generously sized and the pockets are deep enough for gloves and other essentials. Highly recommend!",
    category: "Outerwear",
    productName: "Down-Filled Parka",
    image: "/placeholder.svg?height=400&width=300",
    likes: 89,
    replies: 12,
    featured: true,
    verified: true,
  },
  {
    id: "6",
    name: "Daniel Wilson",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "June 17, 2023",
    rating: 4,
    title: "Stylish and comfortable",
    comment:
      "These jeans are both stylish and comfortable. The stretch in the fabric makes them easy to move in, and they look great dressed up or down. The only improvement I'd suggest is adding more color options.",
    category: "Clothing",
    productName: "Slim Fit Jeans",
    likes: 34,
    replies: 2,
    verified: true,
  },
  {
    id: "7",
    name: "Ava Martinez",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "April 29, 2023",
    rating: 5,
    title: "Elegant and practical watch",
    comment:
      "This watch is the perfect combination of elegance and practicality. The face is clean and easy to read, and the band is comfortable for all-day wear. It's become my everyday timepiece and I receive compliments on it regularly.",
    category: "Accessories",
    productName: "Minimalist Analog Watch",
    image: "/placeholder.svg?height=400&width=300",
    likes: 47,
    replies: 5,
    featured: true,
  },
  {
    id: "8",
    name: "Noah Thompson",
    date: "March 3, 2023",
    rating: 2,
    title: "Disappointing quality",
    comment:
      "I was excited about these boots but unfortunately, they didn't meet my expectations. The sole started separating from the upper after just a few wears. The style is great but the quality doesn't justify the price.",
    category: "Footwear",
    productName: "Leather Hiking Boots",
    likes: 8,
    replies: 15,
  },
  {
    id: "9",
    name: "Isabella Garcia",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "February 14, 2023",
    rating: 5,
    title: "Perfect gift!",
    comment:
      "I bought this scarf as a gift for my mother and she absolutely loves it! The material is incredibly soft and the pattern is beautiful. The packaging was also lovely, making it perfect for gifting. Will definitely purchase from this brand again.",
    category: "Accessories",
    productName: "Cashmere Scarf",
    image: "/placeholder.svg?height=400&width=300",
    likes: 63,
    replies: 4,
    verified: true,
  },
  {
    id: "10",
    name: "Liam Anderson",
    date: "May 22, 2023",
    rating: 4,
    title: "Great summer shirt",
    comment:
      "This shirt is perfect for hot summer days. The linen material is lightweight and breathable. The fit is relaxed without looking sloppy. I've already worn it to several outdoor events and remained comfortable throughout. Would buy again!",
    category: "Clothing",
    productName: "Linen Button-Up Shirt",
    image: "/placeholder.svg?height=400&width=300",
    likes: 29,
    replies: 2,
    featured: true,
  },
  {
    id: "11",
    name: "Charlotte Moore",
    avatar: "/placeholder.svg?height=100&width=100",
    date: "January 30, 2023",
    rating: 5,
    title: "Exceeded expectations",
    comment:
      "These earrings are even more beautiful in person! The craftsmanship is excellent and they're surprisingly lightweight, making them comfortable for all-day wear. They add the perfect touch of elegance to any outfit.",
    category: "Accessories",
    productName: "Sterling Silver Drop Earrings",
    likes: 41,
    replies: 3,
    verified: true,
  },
  {
    id: "12",
    name: "Ethan Taylor",
    date: "June 5, 2023",
    rating: 3,
    title: "Good but not great",
    comment:
      "This hoodie is comfortable and the design is cool, but the fabric is thinner than I expected. It's fine for mild weather but not warm enough for winter. The sizing is accurate and the color matches what was shown online.",
    category: "Clothing",
    productName: "Graphic Hoodie",
    image: "/placeholder.svg?height=400&width=300",
    likes: 17,
    replies: 6,
  },
]
