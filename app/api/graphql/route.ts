import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { ApolloServer } from "@apollo/server"
import { NextRequest } from "next/server"
import { makeExecutableSchema } from "@graphql-tools/schema"
import dotenv from "dotenv"
import { connectDB } from "@/lib/db"
import { resolvers } from "@/resolvers/merge"
import { typeDefs } from "@/schemas/merge"

dotenv.config()

export const schema = makeExecutableSchema({ resolvers, typeDefs })

const server = new ApolloServer({
  schema,
})
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    await connectDB()
    return {
      req,
    }
  },
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
