import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import SimpleTable from '../../client/components/SimpleTable';

const SavedSelectionsList = props => (
  <SimpleTable
    title="Seleções Salvas"
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
        <IconButton aria-label="Delete" >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    }))}
  />
);

SavedSelectionsList.propTypes = {
  groupNames: PropTypes
    .arrayOf(PropTypes.string),
};

SavedSelectionsList.defaultProps = {
  groupNames: [],
};

export default SavedSelectionsList;
