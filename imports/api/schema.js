import { makeExecutableSchema } from 'graphql-tools';
import { Mongo } from 'meteor/mongo';

const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello() {
      return 'Hello, World!';
    },
  },
};

export default makeExecutableSchema({ typeDefs, resolvers });
