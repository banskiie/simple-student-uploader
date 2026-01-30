"use client"
import { useState } from "react"
import { Document, Page } from "react-pdf"
import { pdfjs } from "react-pdf"
import { Button } from "./ui/button"
import { ButtonGroup, ButtonGroupText } from "./ui/button-group"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import UploadDialog from "./upload-dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

export default function PdfViewer({ link }: { link: string }) {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages)
  }

  const prevPage = () => {
    if (pageNumber === 1) return
    setPageNumber((prev) => {
      return prev - 1
    })
  }

  const nextPage = () => {
    if (pageNumber === numPages) return
    setPageNumber((prev) => {
      return prev + 1
    })
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start">
      <UploadDialog />
      <ButtonGroup className="w-fit absolute z-10 right-3 top-3">
        <Button variant="outline" onClick={prevPage} size="icon-sm">
          <ChevronLeft />
        </Button>
        <ButtonGroupText className="font-normal">
          {pageNumber}/{numPages}
        </ButtonGroupText>
        <Button variant="outline" onClick={nextPage} size="icon-sm">
          <ChevronRight />
        </Button>
      </ButtonGroup>
      <div className="bg-slate-300 min-h-screen w-full flex items-center justify-center p-2">
        <Document file={link || ""} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </div>
  )
}
