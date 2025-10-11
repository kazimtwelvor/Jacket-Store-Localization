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
    const existingData = await loadImageMetadataFile()
    const index = existingData.findIndex((item) => item.path === metadata.path)
    if (index >= 0) {
      existingData[index] = { ...existingData[index], ...metadata }
    } else {
      existingData.push(metadata as ImageMetadataDB)
    }

    await writeFile(METADATA_FILE_PATH, JSON.stringify(existingData, null, 2))

    return true
  } catch (error) {
    return false
  }
}

export async function getImageMetadata(imagePath: string): Promise<ImageMetadataDB | null> {
  try {
    const allMetadata = await loadImageMetadataFile()
    return allMetadata.find((item) => item.path === imagePath) || null
  } catch (error) {
    return null
  }
}

async function loadImageMetadataFile(): Promise<ImageMetadataDB[]> {
  try {
    const fs = require("fs/promises")
    try {
      await fs.access(METADATA_FILE_PATH)
    } catch (e) {
      const dirPath = path.dirname(METADATA_FILE_PATH)
      try {
        await fs.mkdir(dirPath, { recursive: true })
      } catch (e) {
      }

      await fs.writeFile(METADATA_FILE_PATH, JSON.stringify([]))
    }

    const data = await fs.readFile(METADATA_FILE_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export function scanUploadsDirectory() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  const images: { path: string; fileName: string; fullPath: string }[] = []

  try {
    const yearDirs = readdirSync(uploadsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
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
    return []
  }
}
function isImageFile(filename: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"]
  const ext = path.extname(filename).toLowerCase()
  return imageExtensions.includes(ext)
}
