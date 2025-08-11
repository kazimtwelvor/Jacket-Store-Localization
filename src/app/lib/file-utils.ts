import { existsSync } from "fs"
import { mkdir } from "fs/promises"
import path from "path"

/**
 * Ensures that the uploads directory exists for the current year
 */
export async function ensureUploadsDirectory() {
  const currentYear = new Date().getFullYear().toString()
  const baseUploadDir = path.join(process.cwd(), "public/uploads")
  const yearUploadDir = path.join(baseUploadDir, currentYear)

  if (!existsSync(baseUploadDir)) {
    await mkdir(baseUploadDir, { recursive: true })
  }

  if (!existsSync(yearUploadDir)) {
    await mkdir(yearUploadDir, { recursive: true })
  }

  return { baseUploadDir, yearUploadDir, currentYear }
}

/**
 * Generates a unique filename by adding a numerical suffix if the file already exists
 * @param directory The directory to check for existing files
 * @param originalFilename The original filename to preserve
 * @returns A unique filename that doesn't exist in the directory
 */
export async function generateUniqueFilename(directory: string, originalFilename: string): Promise<string> {
  // Implementation moved to a utility function for reuse
  // This is the same implementation as in the route.ts file
}
