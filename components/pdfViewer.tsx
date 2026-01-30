"use client"
import UploadDialog from "./upload-dialog"

export default function PdfViewer({ link }: { link: string }) {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start h-screen">
      <UploadDialog />
      <div className="bg-slate-300 h-full w-full flex items-center justify-center p-2">
        {link ? (
          <iframe className="h-full" src={link} width="100%" height="100%" />
        ) : (
          <span>No PDF found.</span>
        )}
      </div>
    </div>
  )
}
