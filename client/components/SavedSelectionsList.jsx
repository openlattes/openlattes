import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import SimpleTable from './SimpleTable';
import db from '../db';

class SavedSelectionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectionNames: [],
    };

    this.deleteSavedSelection = this.deleteSavedSelection.bind(this);
  }

  componentDidMount() {
    db.groups.toArray()
      .then((groups) => {
        this.setState({
          selectionNames: groups.map(({ id, name }) => ({ id, name })),
        });
      });
  }

  deleteSavedSelection(id) {
    db.groups
      .where('id')
      .equals(id)
      .delete()
      .then(() => db.groups.toArray())
      .then((groups) => {
        this.setState({
          selectionNames: groups
            .map(group => ({
              id: group.id,
              name: group.name,
            })),
        });
      });
  }

  render() {
    const { selectionNames } = this.state;

    return selectionNames.length ? (
      <SimpleTable
        headers={[
          {
            id: 'name',
            label: 'Nome',
            align: 'left',
            disablePadding: false,
          },
          {
            id: 'delete',
            label: 'Delete',
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
