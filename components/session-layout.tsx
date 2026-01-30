"use client"
import React from "react"
import { Toaster } from "react-hot-toast"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  }),
})

const SessionLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ApolloProvider client={client}>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </ApolloProvider>
  )
}

export default SessionLayout
