import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Parse URL to extract file path and remove /uploads/ prefix
    const url = new URL(imageUrl, request.url)
    const relativePath = url.pathname.replace('/uploads/', '')
    
    // Construct full file path
    const filePath = join(process.cwd(), 'public', 'uploads', relativePath)

    // Delete the file
    await unlink(filePath)

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}