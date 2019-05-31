import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import CollaborationVisualization from './CollaborationVisualization';
import CollaborationIndicatorQuery from './CollaborationIndicatorQuery';
import db from '../db';

const GET_MEMBERS_IDS = gql`
  query Members_IDs($lattesIds: [String]) {
    members(lattesIds: $lattesIds) {
      _id
    }
  }
`;

class CollaborationIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campusSelection: 'Todos',
      selectionNames: [
        'Nenhum',
        ...(props.selectedMembers.length ? ['Seleção Atual'] : []),
      ],
      selection: props.selectedMembers.length ? 'Seleção Atual' : 'Nenhum',
      selectedMembers2: props.selectedMembers.length ? props.selectedMembers : [],
      typeSelection: 'Todos',
    };

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentDidMount() {
    db.groups.toArray()
      .then((groups) => {
        /* Triggers a warning if the user goes to a different page
         * before running setState(). It can't update the state of
         * an unmounted component.
         */
        this.setState({
          selectionNames: [
            ...this.state.selectionNames,
            ...groups.map(({ name }) => name),
          ],
        });
      });
  }

  handleCampusChange(e) {
    this.setState({
      campusSelection: e.target.value,
      typeSelection: 'Todos',
    });
  }

  handleSelectionChange(e) {
    const selection = e.target.value;
    const { client } = this.props;

    const toDefault = {
      campusSelection: 'Todos',
      typeSelection: 'Todos',
    };

    if (selection === 'Nenhum') {
      this.setState({
        selection,
        selectedMembers2: [],
        ...toDefault,
      });
    } else if (selection === 'Seleção Atual') {
      // Members currently selected in the table
      this.setState({
        selection,
        selectedMembers2: this.props.selectedMembers,
        ...toDefault,
      });
    } else {
      // Group created by the user

      // Get list of Lattes IDs from local DB
      db.groups.get({ name: selection })
        // Fetch API to convert to ObjectIds
        .then(group => client.query({
          query: GET_MEMBERS_IDS,
          variables: {
            lattesIds: group.members,
          },
        }))
        .then(({ data }) => {
          this.setState({
            selection,
            selectedMembers2: data.members.map(({ _id }) => _id),
            ...toDefault,
          });
        })
        .catch(() => {
          this.setState({ selection });
        });
    }
  }

  handleTypeChange(e) {
    this.setState({
      typeSelection: e.target.value,
    });
  }

  render() {
    const {
      selectedMembers2, selectionNames, selection, campusSelection, typeSelection,
    } = this.state;

    return (
      <CollaborationIndicatorQuery
        selectedMembers={selectedMembers2}
        campusSelection={campusSelection}
        typeSelection={typeSelection}
      >
        <CollaborationVisualization
          selectionNames={selectionNames}
          selection={selection}
          onSelectionChange={this.handleSelectionChange}
          onCampusChange={this.handleCampusChange}
          onTypeChange={this.handleTypeChange}
        />
      </CollaborationIndicatorQuery>
    );
  }
}

CollaborationIndicator.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  client: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default withApollo(CollaborationIndicator);
