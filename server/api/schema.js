import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    member(_id: ID!): Member
    members(members: [ID]): [Member]
    production(_id: ID!): Production
    productions(year: Int, member: ID, types: [String]): [Production]
    supervision(_id: ID!): Supervision
    supervisions(year: Int, member: ID, types: [String]): [Supervision]
    indicator(
      collection: Collection = BIBLIOGRAPHIC,
      by: By = year,
      members: [ID]
      campus: [String]
    ): [Indicator]
    typeIndicator(
      collection: Collection = BIBLIOGRAPHIC,
      members: [ID]
    ): [TypeCount]
    nodes(members: [ID]): [Member]
    edges(members: [ID]): [Edge]
  }

  type Indicator {
    year: Int
    member: String 
    count: Int
    type: String
  }

  type TypeCount {
    count: Int
    type: String
  }

  type Member {
    _id: ID
    id: ID
    fullName: String
    citationName: String
    lattesId: String
    cvLastUpdate: String
    campus: String
  }

  type Production {
    _id: ID
    title: String
    year: Int
    authors: String
    magazine: String
    volume: String
    type: String
    collection: String
    members: [Member]
  }

  type Supervision {
    _id: ID
    supervisedStudent: String,
    fundingAgency : String,
    documentTitle : String,
    completed: Boolean,
    degreeType: String,
    year: Int,
    institution: String
    members: [Member]
  }

  type Edge {
    source: ID
    target: ID
    weight: Int
    productions: [Production]
  }

  enum Collection {
    SUPERVISION
    BIBLIOGRAPHIC
  }

  enum By {
    year
    member
  }
`;

export default typeDefs;
