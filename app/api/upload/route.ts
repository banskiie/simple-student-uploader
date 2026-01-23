import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const file = formData.get("file") as File | null
  const studentName = formData.get("studentName") as string | null
  const studentClass = formData.get("studentClass") as string | null

  if (!file || !studentName || !studentClass) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
  }

  // ZIP validation
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return NextResponse.json(
      { error: "Only ZIP files allowed" },
      { status: 415 },
    )
  }

  const timestamp = Date.now()

  // Sanitize filename
  const safeName = studentName.replace(/[^A-Z0-9]/gi, "_")
  const safeClass = studentClass.replace(/[^A-Z0-9]/gi, "_")

  const newFileName = `${safeClass}_${safeName}_${timestamp}.zip`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), "public/uploads")
  await fs.mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, newFileName)
  await fs.writeFile(filePath, buffer)

  return NextResponse.json({
    success: true,
    filename: newFileName,
    url: `/uploads/${newFileName}`,
  })
}
