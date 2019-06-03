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
  constructor(props) {
    super(props);

    this.state = {
      /* To reload the saved selections table when new
       * selection is added.
       */
      newGroupName: undefined,
    };

    this.handleSelectionSave = this.handleSelectionSave.bind(this);
  }

  handleSelectionSave(newGroupName) {
    this.setState({ newGroupName });
  }

  render() {
    const { selectedMembers } = this.props;
    const { newGroupName } = this.state;

    return (
      <Query query={GET_MEMBERS}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return 'Erro';

          const groupNames = [
            ...data.members
              .reduce((set, { groups }) => new Set([...set, ...groups]), new Set()),
          ];

          return (
            <div>
              <SavedGroupsList
                key={newGroupName}
                groupNames={groupNames}
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
                onSelectionSave={this.handleSelectionSave}
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
