"use server"

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

/**
 * Uploads an image to the local filesystem and returns the URL
 * @param file The file to upload
 * @returns The URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
  try {

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const fileExtension = path.extname(file.name)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)
    const uniqueFilename = `${Date.now()}-${sanitizedName}-${uuidv4().substring(0, 8)}${fileExtension}`
    const filePath = path.join(uploadsDir, uniqueFilename)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filePath, buffer)
    const publicUrl = `/uploads/${uniqueFilename}`

    return publicUrl
  } catch (error) {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    return `/placeholder.svg?height=600&width=600&query=upload failed ${file.name}&id=${uniqueId}`
  }
}
