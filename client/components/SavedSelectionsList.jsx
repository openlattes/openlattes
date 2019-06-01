import React, { Component } from 'react';

import SimpleTable from './SimpleTable';
import db from '../db';

class SavedSelectionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectionNames: [],
    };
  }

  componentDidMount() {
    db.groups.toArray()
      .then((groups) => {
        this.setState({
          selectionNames: groups.map(({ id, name }) => ({ id, name })),
        });
      });
  }

  render() {
    const { selectionNames } = this.state;

    return selectionNames.length ? (
      <SimpleTable
        headers={[{
          id: 'name',
          label: 'Nome',
          align: 'left',
          disablePadding: false,
        }]}
        data={selectionNames}
      />) : null;
  }
}

export default SavedSelectionsList;
