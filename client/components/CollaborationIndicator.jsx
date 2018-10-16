import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Graph from './Graph';

const GET_GRAPH = gql`
  {
    graph {
      nodes {
        id
        fullName
      }
      edges {
        source
        target
        weight
      }
    }
  }
`;

const CollaborationIndicator = () => (
  <Query query={GET_GRAPH}>
    {({
      loading, error, data,
    }) => {
      if (loading) return <p>loading...</p>;
      if (error) return <p>error</p>;

      return <Graph data={data.graph} />;
    }}
  </Query>
);

export default CollaborationIndicator;
