import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import EnhancedTable from './EnhancedTable';

const GET_MEMBERS = gql`
  {
    members {
      _id
      fullName
      citationName
      lattesId
      cvLastUpdate
    }
  }
`;

class MembersList extends PureComponent {
  render() {
    return (
      <Query query={GET_MEMBERS}>
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Erro';

          return (
            <EnhancedTable
              data={data.members.map(({
                _id, fullName, citationName, lattesId, cvLastUpdate,
              }) => ({
                id: _id, fullName, citationName, lattesId, cvLastUpdate,
              }))}
            />
          );
        }}
      </Query>
    );
  }
}

export default MembersList;
