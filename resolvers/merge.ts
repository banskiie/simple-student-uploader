import { mergeResolvers } from "@graphql-tools/merge"
import sessionResolvers from "./session.resolver"

export const resolvers = mergeResolvers([sessionResolvers])
