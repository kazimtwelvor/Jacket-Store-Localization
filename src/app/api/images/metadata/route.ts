import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import { statSync } from "fs"
import sharp from "sharp"
import { getImageMetadata } from "@/src/app/lib/image-metadata"

// Function to extract image dimensions
async function getImageDimensions(filePath: string) {
  try {
    const metadata = await sharp(filePath).metadata()
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    }
  } catch (error) {
    return { width: 0, height: 0 }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const urlPath = new URL(imageUrl, "http://localhost").pathname
    const filePath = path.join(process.cwd(), "public", urlPath)
    try {
      const stats = statSync(filePath)

      const fileSize = stats.size
      const createdDate = stats.birthtime
      const modifiedDate = stats.mtime
      const extension = path.extname(filePath).toLowerCase()
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".avif": "image/avif",
      }
      const fileType = mimeTypes[extension] || "application/octet-stream"
      const dimensions = await getImageDimensions(filePath)
      const fileName = path.basename(filePath)
      const dbMetadata = await getImageMetadata(urlPath)
      const metadata = {
        name: fileName,
        type: fileType,
        size: fileSize,
        dimensions,
        uploadedOn: dbMetadata?.uploadedOn?.toISOString() || createdDate.toISOString(),
        lastModified: modifiedDate.toISOString(),
        uploadedBy: dbMetadata?.uploadedBy || "Unknown User",
        uploadedById: dbMetadata?.uploadedById || "",
        uploadedTo: dbMetadata?.uploadedToPage || "Unknown Page",
        path: urlPath,
        altText: dbMetadata?.altText || "",
        title: dbMetadata?.title || "",
        caption: dbMetadata?.caption || "",
        description: dbMetadata?.description || "",
        excludeFromSitemap: dbMetadata?.excludeFromSitemap || false,
      }

      return NextResponse.json(metadata)
    } catch (error) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to get image metadata" }, { status: 500 })
  }
}