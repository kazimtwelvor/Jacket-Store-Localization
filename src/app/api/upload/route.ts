import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const currentYear = new Date().getFullYear().toString();
const baseUploadDir = path.join(process.cwd(), "public/uploads");
const yearUploadDir = path.join(baseUploadDir, currentYear);

// Utility to generate a unique filename
async function generateUniqueFilename(directory: string, originalFilename: string): Promise<string> {
  const lastDotIndex = originalFilename.lastIndexOf(".");
  const name = lastDotIndex !== -1 ? originalFilename.substring(0, lastDotIndex) : originalFilename;
  const extension = lastDotIndex !== -1 ? originalFilename.substring(lastDotIndex) : "";

  if (!existsSync(path.join(directory, originalFilename))) {
    return originalFilename;
  }

  const files = await readdir(directory);
  let highestSuffix = 0;
  const suffixRegex = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-([0-9]+)\\${extension}$`);

  for (const file of files) {
    const match = file.match(suffixRegex);
    if (match && match[1]) {
      const suffix = Number.parseInt(match[1], 10);
      if (suffix > highestSuffix) {
        highestSuffix = suffix;
      }
    }
  }

  return `${name}-${highestSuffix + 1}${extension}`;
}

// Handler function
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || "*";

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Content-Type": "application/json",
        },
      });
    }

    // Ensure base and year directories exist
    if (!existsSync(baseUploadDir)) {
      await mkdir(baseUploadDir, { recursive: true });
    }

    if (!existsSync(yearUploadDir)) {
      await mkdir(yearUploadDir, { recursive: true });
    }

    // Sanitize filename
    let sanitizedFilename = file.name.replace(/[\s_&%#?]+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const originalFilename = sanitizedFilename;
    const uniqueFilename = await generateUniqueFilename(yearUploadDir, originalFilename);
    const filePath = path.join(yearUploadDir, uniqueFilename);

    // Write buffer to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${currentYear}/${uniqueFilename}`;

    return new NextResponse(JSON.stringify({
      url: fileUrl,
      secure_url: fileUrl,
      public_id: `${currentYear}/${uniqueFilename}`,
      original_filename: originalFilename,
      unique_filename: uniqueFilename,
    }), {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({
      error: "Upload failed",
      details: error instanceof Error ? error.message : String(error),
    }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json",
      },
    });
  }
}

// Optional: If you're using Edge Runtime or want to handle OPTIONS globally
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "*";

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
