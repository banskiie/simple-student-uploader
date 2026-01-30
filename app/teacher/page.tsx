"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react"
import gql from "graphql-tag"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

const GET_LAB_LINK = gql`
  query GetLabLink($lab: String) {
    getLabLink(lab: $lab)
  }
`

const SET_LAB_LINK = gql`
  mutation SetLabLink($lab: String, $pdf: String) {
    setLabLink(lab: $lab, pdf: $pdf)
  }
`

const Page = () => {
  const [selectedLab, setSelectedLab] = useState<string>("a")
  const [pdfLink, setPdfLink] = useState<string>("")
  const [getLink, { data, loading: getLinkLoading }] = useLazyQuery(
    GET_LAB_LINK,
    {
      fetchPolicy: "network-only",
    },
  )
  const link = (data as any)?.getLabLink
  const [changeLink, { loading: changeLinkLoading }] = useMutation(
    SET_LAB_LINK,
    {
      fetchPolicy: "network-only",
    },
  )
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (selectedLab) {
      getLink({
        variables: {
          lab: selectedLab,
        },
      })
    }
  }, [selectedLab])

  useEffect(() => {
    if (link) {
      setPdfLink(link)
    } else {
      setPdfLink("")
    }
  }, [link])

  return (
    <div className="w-full bg-slate-400 h-screen flex items-center justify-center">
      <div className="p-2 bg-white flex flex-col items-center gap-2">
        <Select value={selectedLab} onValueChange={setSelectedLab}>
          <SelectTrigger className="w-full ">
            <SelectValue placeholder="Select lab" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Computer Lab</SelectLabel>
              <SelectItem value="a">Lab A</SelectItem>
              <SelectItem value="b">Lab B</SelectItem>
              <SelectItem value="c">Lab C</SelectItem>
              <SelectItem value="d">Lab D</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* 
        <Button
          disabled={changeLinkLoading}
          onClick={() =>
            changeLink({
              variables: {
                lab: selectedLab,
                pdf: pdfLink,
              },
            })
          }
        >
          Set PDF
        </Button> */}

        <Input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button
          className="w-full"
          disabled={!file || changeLinkLoading}
          onClick={async () => {
            if (!file) return

            // 1. Upload file
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload-pdf", {
              method: "POST",
              body: formData,
            })

            const data = await res.json()

            // 2. Save link in DB via GraphQL
            await changeLink({
              variables: {
                lab: selectedLab,
                pdf: data.path, // 👈 "/uploads/xxx.pdf"
              },
            })

            setPdfLink(data.path)

            toast.success(
              "Pdf uploaded and shown to students for lab " + selectedLab,
            )
          }}
        >
          Upload & Set PDF
        </Button>
        {pdfLink ? (
          <span className="text-xs px-2">
            Current Link: <span className="underline">{pdfLink}</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No PDF shown.</span>
        )}
        <Button
          variant="link"
          disabled={changeLinkLoading}
          onClick={() => {
            changeLink({
              variables: {
                lab: selectedLab,
                pdf: "",
              },
            })
            setPdfLink("")
            setFile(null)
          }}
        >
          Clear Link
        </Button>
      </div>
    </div>
  )
}

export default Page
