"use client"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import('@/components/pdfViewer'), {
  ssr: false,
});


const App = () => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [studentName, setStudentName] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a ZIP file")
      return
    }

    if (!studentName || !studentClass) {
      alert("Please enter name and class")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("studentName", studentName)
      formData.append("studentClass", studentClass)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      alert("Upload successful!")

      // ✅ Clear file input + state
      setFile(null)
      if (fileRef.current) fileRef.current.value = ""
      setStudentClass("")
      setStudentName("")
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex  flex-col gap-2">
          <Input
            placeholder="Enter your full name"
            value={studentName}
            onChange={(e) => {
              const value = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9 ]/g, "")
              setStudentName(value)
            }}
          />
          <Input
            placeholder="Enter your class name"
            value={studentClass}
            onChange={(e) => {
              const value = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9 ]/g, "")
              setStudentClass(value)
            }}
          />
          <Input
            ref={fileRef}
            type="file"
            accept=".zip,application/zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span className="text-xs text-muted-foreground">
            Note: Please upload your submission as a compressed{" "}
            <span className="font-medium underline">.zip</span> file
          </span>
          {file && (
            <span className="text-sm">
              Selected:{" "}
              <span
                onClick={() => {
                  setFile(null)
                  if (fileRef.current) fileRef.current.value = ""
                }}
                className="text-sm text-muted-foreground hover:text-destructive hover:underline hover:cursor-pointer"
              >
                {file.name}
              </span>
            </span>
          )}
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload ZIP"}
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full">
        <PdfViewer />
      </div>
    </div>
  )
}


export default App
