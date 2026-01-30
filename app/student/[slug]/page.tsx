"use client"
import React from "react"
import dynamic from "next/dynamic"
import gql from "graphql-tag"
import { useParams } from "next/navigation"
import { useQuery } from "@apollo/client/react"

const PdfViewer = dynamic(() => import("@/components/pdfViewer"), {
  ssr: false,
})

const GET_LAB_LINK = gql`
  query GetLabLink($lab: String) {
    getLabLink(lab: $lab)
  }
`

const Page = () => {
  const { slug } = useParams()
  const { data } = useQuery(GET_LAB_LINK, {
    fetchPolicy: "network-only",
    variables: {
      lab: slug,
    },
  })
  const link = (data as any)?.getLabLink

  return <PdfViewer link={link} />
}

export default Page
