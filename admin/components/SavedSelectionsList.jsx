import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import SimpleTable from '../../client/components/SimpleTable';

class SavedSelectionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectionNames: [],
      /* Use as key to create a new intance of the component
       * when updating (fully uncontrolled component with a key).
       */
      deleteId: -1,
    };
  }

  render() {
    const { selectionNames, deleteId } = this.state;

    return selectionNames.length ? (
      <SimpleTable
        title="Seleções Salvas"
        key={deleteId}
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
        data={selectionNames.map(selectionName => ({
          ...selectionName,
          delete: (
            <IconButton
              aria-label="Delete"
              onClick={() => this.deleteSavedSelection(selectionName.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          ),
        }))}
      />) : null;
  }
}

export default SavedSelectionsList;
