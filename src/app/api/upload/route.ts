import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, readdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"


const currentYear = new Date().getFullYear().toString()
const baseUploadDir = path.join(process.cwd(), "public/uploads")
const yearUploadDir = path.join(baseUploadDir, currentYear)
/**
 * @param directory 
 * @param originalFilename 
 */
async function generateUniqueFilename(directory: string, originalFilename: string): Promise<string> {
  const lastDotIndex = originalFilename.lastIndexOf(".")
  const name = lastDotIndex !== -1 ? originalFilename.substring(0, lastDotIndex) : originalFilename
  const extension = lastDotIndex !== -1 ? originalFilename.substring(lastDotIndex) : ""

  if (!existsSync(path.join(directory, originalFilename))) {
    return originalFilename
  }

  const files = await readdir(directory)
  let highestSuffix = 0
  const suffixRegex = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}_([0-9]+)\\${extension}$`)

  for (const file of files) {
    const match = file.match(suffixRegex)
    if (match && match[1]) {
      const suffix = Number.parseInt(match[1], 10)
      if (suffix > highestSuffix) {
        highestSuffix = suffix
      }
    }
  }

  return `${name}_${highestSuffix + 1}${extension}`
}

export async function POST(request: NextRequest) {
  // Handle CORS
  const origin = request.headers.get("origin") || "http://localhost:3000"

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin,
          },
        },
      )
    }

    // Ensure the base uploads directory exists
    if (!existsSync(baseUploadDir)) {
      await mkdir(baseUploadDir, { recursive: true })
    }

    // Ensure the year-specific directory exists
    if (!existsSync(yearUploadDir)) {
      await mkdir(yearUploadDir, { recursive: true })
    }

    // Get the original filename and sanitize it
    const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")

    // Generate a unique filename that preserves the original name
    const uniqueFilename = await generateUniqueFilename(yearUploadDir, originalFilename)

    // Create the full file path
    const filePath = path.join(yearUploadDir, uniqueFilename)

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Write the file to the year-specific uploads directory
    await writeFile(filePath, buffer)

    // Return the URL that can be used to access the file
    const fileUrl = `/uploads/${currentYear}/${uniqueFilename}`

    return NextResponse.json(
      {
        url: fileUrl,
        secure_url: fileUrl,
        public_id: `${currentYear}/${uniqueFilename}`,
        original_filename: originalFilename,
        unique_filename: uniqueFilename,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": origin,
        },
      },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": origin,
        },
      },
    )
  }
}