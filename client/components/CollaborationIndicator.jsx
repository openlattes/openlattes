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
      groupNames: [
        'Nenhum',
        ...(props.selectedMembers.length ? ['Seleção Atual'] : []),
      ],
      groupSelection: props.selectedMembers.length ? 'Seleção Atual' : 'Nenhum',
      selectedGroupMembers: props.selectedMembers.length ? props.selectedMembers : [],
      typeSelection: 'Todos',
    };

    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentDidMount() {
    db.groups.toArray()
      .then((groups) => {
        this.setState({
          groupNames: [
            ...this.state.groupNames,
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

  handleGroupChange(e) {
    const groupSelection = e.target.value;
    const { client } = this.props;

    const toDefault = {
      campusSelection: 'Todos',
      typeSelection: 'Todos',
    };

    if (groupSelection === 'Nenhum') {
      this.setState({
        groupSelection,
        selectedGroupMembers: [],
        ...toDefault,
      });
    } else if (groupSelection === 'Seleção Atual') {
      // Members currently selected in the table
      this.setState({
        groupSelection,
        selectedGroupMembers: this.props.selectedMembers,
        ...toDefault,
      });
    } else {
      // Group created by the user

      // Get list of Lattes IDs from local DB
      db.groups.get({ name: groupSelection })
        // Fetch API to convert to ObjectIds
        .then(group => client.query({
          query: GET_MEMBERS_IDS,
          variables: {
            lattesIds: group.members,
          },
        }))
        .then(({ data }) => {
          this.setState({
            groupSelection,
            selectedGroupMembers: data.members.map(({ _id }) => _id),
            ...toDefault,
          });
        })
        .catch(() => {
          this.setState({ groupSelection });
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
      selectedGroupMembers, groupNames, groupSelection, campusSelection, typeSelection,
    } = this.state;

    return (
      <CollaborationIndicatorQuery
        selectedMembers={selectedGroupMembers}
        campusSelection={campusSelection}
        typeSelection={typeSelection}
      >
        <CollaborationVisualization
          groupNames={groupNames}
          groupSelection={groupSelection}
          onGroupChange={this.handleGroupChange}
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
