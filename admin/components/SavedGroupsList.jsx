import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import SimpleTable from '../../client/components/SimpleTable';

const DELETE_GROUP = gql`
  mutation($group: String) {
    deleteGroup(group: $group)
  }
`;

class SavedSelectionsList extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick(deleteGroup, groupName) {
    deleteGroup({ variables: { group: groupName } });
    this.props.refetch();
  }

  render() {
    const { groupNames } = this.props;

    return (
      <Mutation mutation={DELETE_GROUP}>
        {deleteGroup => (
          <SimpleTable
            key={groupNames.length}
            title="Grupos"
            headers={[
              {
                id: 'name',
                label: 'Nome',
                align: 'left',
                disablePadding: false,
              },
              {
                id: 'delete',
                label: 'Excluir',
                align: 'right',
                disablePadding: false,
              },
            ]}
            data={groupNames.map(groupName => ({
              id: groupName,
              name: groupName,
              delete: (
                <IconButton
                  aria-label="Delete"
                  onClick={() => this.handleDeleteClick(deleteGroup, groupName)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              ),
            }))}
          />
        )}
      </Mutation>
    );
  }
}

SavedSelectionsList.propTypes = {
  groupNames: PropTypes
    .arrayOf(PropTypes.string),
  refetch: PropTypes.func.isRequired,
};

SavedSelectionsList.defaultProps = {
  groupNames: [],
};

export default SavedSelectionsList;
