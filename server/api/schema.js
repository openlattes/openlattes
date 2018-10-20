import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String
    member(_id: ID!): Member
    members: [Member]
    production(_id: ID!): Production
    productions: [Production]
    indicator(members: [ID]): [Indicator]
    typeIndicator: [TypeCount]
    memberIndicator: [MemberCount]
    graph: Graph
  }

  type Graph {
    nodes: [Member]
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

  type MemberCount {
    count: Int
    member: String
  }

  type Member {
    _id: ID
    id: ID
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

  type Edge {
    source: ID
    target: ID
    weight: Int
    productions: [ID]
  }
`;

export default typeDefs;
