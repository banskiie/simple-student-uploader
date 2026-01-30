import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), "public/pdfs")
  await fs.mkdir(uploadDir, { recursive: true })

  const filename = `${Date.now()}-${file.name}`
  const filePath = path.join(uploadDir, filename)

  await fs.writeFile(filePath, buffer)

  return NextResponse.json({
    path: `/pdfs/${filename}`,
  })
}
