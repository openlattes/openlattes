import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class App extends Component {
  render() {
    return (
      <Query
        query={gql`
          {
            hello
          }
        `}
        children={({ loading, error, data }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>error</p>;

          return <p>{data.hello}</p>;
        }}
      />
    );
  }
}

export default App;
