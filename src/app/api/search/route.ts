import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with your actual database queries
const mockProducts = [
  {
    id: 1,
    name: "CLASSIC BIKER LEATHER JACKET",
    category: "biker-jackets",
    subcategory: "Leather Jackets",
    gender: "women",
    price: 299.99,
    image: "/images/women-biker.webp",
    description: "Premium leather biker jacket with classic styling"
  },
  {
    id: 2,
    name: "VINTAGE BOMBER JACKET",
    category: "bomber-jackets",
    subcategory: "Bomber Jackets",
    gender: "women",
    price: 249.99,
    image: "/images/women-puffer.webp",
    description: "Authentic vintage-style bomber jacket"
  },
  {
    id: 3,
    name: "RACING MOTORCYCLE JACKET",
    category: "racing-jackets",
    subcategory: "Racing Jackets",
    gender: "women",
    price: 399.99,
    image: "/images/women-leather.webp",
    description: "High-performance racing motorcycle jacket"
  },
  {
    id: 4,
    name: "LUXURY TRENCH COAT",
    category: "trench-coats",
    subcategory: "Trench Coats",
    gender: "women",
    price: 599.99,
    image: "/images/trench-coat.webp",
    description: "Elegant luxury trench coat with premium materials"
  },
  {
    id: 5,
    name: "PREMIUM LEATHER MOTORCYCLE JACKET",
    category: "moto-jackets",
    subcategory: "Moto Jackets",
    gender: "women",
    price: 349.99,
    image: "/images/women-leather.webp",
    description: "Premium leather motorcycle jacket for riders"
  },
  {
    id: 6,
    name: "CLASSIC DENIM JACKET",
    category: "denim-jackets",
    subcategory: "Denim Jackets",
    gender: "women",
    price: 129.99,
    image: "/images/women-denim.webp",
    description: "Classic denim jacket with timeless appeal"
  },
  {
    id: 7,
    name: "VARSITY SPORTS JACKET",
    category: "varsity-jackets",
    subcategory: "Varsity Jackets",
    gender: "women",
    price: 179.99,
    image: "/images/women-letterman.webp",
    description: "Classic varsity sports jacket with retro styling"
  },
  {
    id: 8,
    name: "WARM WOOL COAT",
    category: "wool-coats",
    subcategory: "Wool Coats",
    gender: "women",
    price: 449.99,
    image: "/images/trench-coat.webp",
    description: "Warm and stylish wool coat for cold weather"
  }
];

const mockCategories = [
  "Leather Jackets",
  "Women's Jackets", 
  "Men's Jackets",
  "Biker Jackets",
  "Bomber Jackets",
  "Moto Jackets",
  "Racing Jackets",
  "Trench Coats",
  "Wool Coats",
  "Varsity Jackets",
  "Denim Jackets",
  "Size Guide"
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          products: [],
          categories: [],
          suggestions: mockCategories.slice(0, 5)
        }
      });
    }

    // Search in products
    const filteredProducts = mockProducts.filter(product => {
      const searchTerm = query.toLowerCase();
      const matchesQuery = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.subcategory.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      
      const matchesCategory = category ? product.category === category : true;
      const matchesGender = gender ? product.gender === gender || product.gender === 'unisex' : true;
      
      return matchesQuery && matchesCategory && matchesGender;
    }).slice(0, limit);

    // Search in categories
    const filteredCategories = mockCategories.filter(cat => 
      cat.toLowerCase().includes(query.toLowerCase())
    );

    // Generate suggestions based on query
    const suggestions = mockCategories
      .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        products: filteredProducts,
        categories: filteredCategories,
        suggestions: suggestions,
        total: filteredProducts.length,
        query: query
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
