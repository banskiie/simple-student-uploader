import { mergeTypeDefs } from "@graphql-tools/merge"
import sessionSchema from "./session.schema"

export const typeDefs = mergeTypeDefs([sessionSchema])
