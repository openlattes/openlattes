import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String
    member(_id: ID!): Member
    members: [Member]
    production(_id: ID!): Production
    productions: [Production]
    coauthorships: [CoAuthorship]
    indicator: [Indicator]
    typeIndicator: [TypeCount]
    edges: [Edge]
  }

  type Indicator {
    year: Int
    count: Int
    type: String
  }

  type TypeCount {
    count: Int
    type: String
  }

  type Member {
    _id: ID
    fullName: String
    citationName: String
    lattesId: String
    cvLastUpdate: String
  }

  type Production {
    _id: ID
    title: String
    year: Int
    authors: String
    magazine: String
    volume: String
    type: String
    category: String
    members: [Member]
  }

  type CoAuthorship {
    _id: ID
    members: [ID]
    productions: [ID]
  }

  type Edge {
    source: ID
    target: ID
    weight: Int
    productions: [ID]
  }
`;

export default typeDefs;
