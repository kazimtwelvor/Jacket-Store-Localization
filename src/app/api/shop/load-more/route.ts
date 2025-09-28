import { NextRequest, NextResponse } from 'next/server'
import getProducts from '../../../actions/get-products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      materials = [], 
      styles = [], 
      colors = [], 
      genders = [], 
      sizes = [],
      categoryId,
      colorId,
      sizeId,
      search,
      page = 1, 
      limit = 20,
      sort = 'popular'
    } = body

    const productsData = await getProducts({
      materials,
      styles,
      colors,
      genders,
      sizes,
      categoryId,
      colorId,
      sizeId,
      search,
      page,
      limit,
      sort,
    })

    return NextResponse.json({
      success: true,
      products: productsData.products || [],
      pagination: productsData.pagination || {
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
        productsPerPage: limit,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    })
  } catch (error) {
    console.error('Error loading more shop products:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load more products',
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          productsPerPage: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      },
      { status: 500 }
    )
  }
} 