import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    member(_id: ID!): Member
    members: [Member]
    production(_id: ID!): Production
    productions: [Production]
    supervision(_id: ID!): Supervision
    supervisions: [Supervision]
    indicator(
      collection: Collection = BIBLIOGRAPHIC,
      members: [ID]
    ): [Indicator]
    typeIndicator(
      collection: Collection = BIBLIOGRAPHIC,
      members: [ID]
    ): [TypeCount]
    memberIndicator: [MemberCount]
    nodes(members: [ID]): [Member]
    edges(members: [ID]): [Edge]
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
    productions: [ID]
  }

  enum Collection {
    SUPERVISION
    BIBLIOGRAPHIC
  }
`;

export default typeDefs;
