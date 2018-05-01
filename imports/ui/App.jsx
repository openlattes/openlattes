import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const App = () => (
  <Query
    query={gql`
      {
        hello
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>loading...</p>;
      if (error) return <p>error</p>;

      return <p>{data.hello}</p>;
    }}
  </Query>
);

export default App;
