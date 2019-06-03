import React from 'react';
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

const SavedSelectionsList = props => (
  <Mutation mutation={DELETE_GROUP}>
    {deleteGroup => (
      <SimpleTable
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
        data={props.groupNames.map(groupName => ({
          id: groupName,
          name: groupName,
          delete: (
            <IconButton
              aria-label="Delete"
              onClick={() => deleteGroup({ variables: { group: groupName } })}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          ),
        }))}
      />
    )}
  </Mutation>
);

SavedSelectionsList.propTypes = {
  groupNames: PropTypes
    .arrayOf(PropTypes.string),
};

SavedSelectionsList.defaultProps = {
  groupNames: [],
};

export default SavedSelectionsList;
