import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import EnhancedTable from './EnhancedTable';
import Loading from './Loading';

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
    const { selectedMembers } = this.props;

    return (
      <Query query={GET_MEMBERS}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return 'Erro';

          return (
            <EnhancedTable
              data={data.members.map(({
                _id, fullName, citationName, lattesId, cvLastUpdate,
              }) => ({
                id: _id,
                fullName,
                citationName,
                lattesId,
                cvLastUpdate: new Date(cvLastUpdate),
              }))}
              selectedMembers={selectedMembers}
            />
          );
        }}
      </Query>
    );
  }
}

MembersList.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string),
};

MembersList.defaultProps = {
  selectedMembers: [],
};

export default MembersList;
