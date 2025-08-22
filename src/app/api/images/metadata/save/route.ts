import { saveImageMetadata } from "@/src/app/lib/image-metadata"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.path) {
      return NextResponse.json({ error: "Image path is required" }, { status: 400 })
    }

    // Save the metadata
    const success = await saveImageMetadata({
      path: data.path,
      fileName: data.name || "",
      altText: data.altText,
      title: data.title,
      caption: data.caption,
      description: data.description,
      excludeFromSitemap: data.excludeFromSitemap,
      // These would normally come from the authenticated user and page context
      uploadedBy: data.uploadedBy || "Unknown User",
      uploadedById: data.uploadedById || "",
      uploadedToPage: data.uploadedTo || "Unknown Page",
      uploadedOn: data.uploadedOn ? new Date(data.uploadedOn) : new Date(),
    })

    if (!success) {
      throw new Error("Failed to save metadata")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving image metadata:", error)
    return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 })
  }
}