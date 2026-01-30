import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"
import { toast } from "react-hot-toast"

const UploadDialog = () => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [studentName, setStudentName] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [uploading, setUploading] = useState(false)
  const [open, setOpen] = useState<boolean>(false)

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

      toast.success(
        "Your submission is uploaded. Please notify your proctor.",
        {
          duration: 5000,
        },
      )
      onClose()
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const onClose = () => {
    setOpen(false)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ""
    setStudentClass("")
    setStudentName("")
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="absolute bottom-4 right-8" variant="destructive">
            Ready to Submit?
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Submission</DialogTitle>
            <DialogDescription>
              <span className="text-xs text-muted-foreground">
                Please upload your submission as a compressed{" "}
                <span className="font-medium underline">.zip</span> file
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!file || !studentClass || !studentClass || uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default UploadDialog
