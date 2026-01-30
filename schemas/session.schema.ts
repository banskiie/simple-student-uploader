import { gql } from "graphql-tag"

export default gql`
  type Session {
    lab: String!
    pdf: String!
  }

  type Query {
    getLabLink(lab: String): String
  }

  type Mutation {
    setLabLink(lab: String, pdf: String): String
    createSession(lab: String, pdf: String): String
  }
`
