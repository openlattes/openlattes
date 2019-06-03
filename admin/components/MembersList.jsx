import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import EnhancedTable from './EnhancedTable';
import Loading from '../../client/components/Loading';
import SavedGroupsList from './SavedGroupsList';

const GET_MEMBERS = gql`
  {
    members {
      _id
      fullName
      citationName
      lattesId
      cvLastUpdate
      groups
    }
  }
`;

class MembersList extends PureComponent {
  render() {
    const { selectedMembers } = this.props;

    return (
      <Query query={GET_MEMBERS}>
        {({
          loading, error, data, refetch,
        }) => {
          if (loading) return <Loading />;
          if (error) return 'Erro';

          const groupNames = [
            ...data.members
              .reduce((set, { groups }) => new Set([...set, ...groups]), new Set()),
          ];

          return (
            <div>
              <SavedGroupsList
                groupNames={groupNames}
                refetch={refetch}
              />
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
                refetch={refetch}
              />
            </div>
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
