import { readdirSync } from "fs"
import path from "path"
import { writeFile } from "fs/promises"

interface ImageMetadataDB {
  path: string
  fileName: string
  uploadedBy: string
  uploadedById: string
  uploadedToPage: string
  uploadedOn: Date
  altText?: string
  title?: string
  caption?: string
  description?: string
  excludeFromSitemap?: boolean
}

// This would normally be a database table or collection
// For simplicity in this example, we're using a JSON file
const METADATA_FILE_PATH = path.join(process.cwd(), "data", "image-metadata.json")

export async function saveImageMetadata(metadata: Partial<ImageMetadataDB>) {
  try {
    // Load existing metadata
    const existingData = await loadImageMetadataFile()

    // Find if record exists by path
    const index = existingData.findIndex((item) => item.path === metadata.path)

    if (index >= 0) {
      // Update existing record
      existingData[index] = { ...existingData[index], ...metadata }
    } else {
      // Add new record
      existingData.push(metadata as ImageMetadataDB)
    }

    // Save back to file
    await writeFile(METADATA_FILE_PATH, JSON.stringify(existingData, null, 2))

    return true
  } catch (error) {
    console.error("Error saving image metadata:", error)
    return false
  }
}

export async function getImageMetadata(imagePath: string): Promise<ImageMetadataDB | null> {
  try {
    const allMetadata = await loadImageMetadataFile()
    return allMetadata.find((item) => item.path === imagePath) || null
  } catch (error) {
    console.error("Error getting image metadata:", error)
    return null
  }
}

async function loadImageMetadataFile(): Promise<ImageMetadataDB[]> {
  try {
    // Create default metadata file if it doesn't exist
    const fs = require("fs/promises")
    try {
      await fs.access(METADATA_FILE_PATH)
    } catch (e) {
      // Make sure the directory exists
      const dirPath = path.dirname(METADATA_FILE_PATH)
      try {
        await fs.mkdir(dirPath, { recursive: true })
      } catch (e) {
        // Directory already exists, continue
      }

      // Create empty metadata file
      await fs.writeFile(METADATA_FILE_PATH, JSON.stringify([]))
    }

    // Read and parse the file
    const data = await fs.readFile(METADATA_FILE_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error loading image metadata file:", error)
    return []
  }
}

export function scanUploadsDirectory() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  const images: { path: string; fileName: string; fullPath: string }[] = []

  try {
    // Get all year directories
    const yearDirs = readdirSync(uploadsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    // Scan each year directory for images
    for (const year of yearDirs) {
      const yearPath = path.join(uploadsDir, year)
      const files = readdirSync(yearPath, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && isImageFile(dirent.name))
        .map((dirent) => ({
          path: `/uploads/${year}/${dirent.name}`,
          fileName: dirent.name,
          fullPath: path.join(yearPath, dirent.name),
        }))

      images.push(...files)
    }

    return images
  } catch (error) {
    console.error("Error scanning uploads directory:", error)
    return []
  }
}

// Helper to determine if a file is an image based on extension
function isImageFile(filename: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"]
  const ext = path.extname(filename).toLowerCase()
  return imageExtensions.includes(ext)
}
