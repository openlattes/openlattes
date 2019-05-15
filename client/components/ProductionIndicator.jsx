import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ProductionVisualization from './ProductionVisualization';
import ProductionIndicatorQuery from './ProductionIndicatorQuery';
import db from '../db';

const GET_MEMBERS_IDS = gql`
  query Members_IDs($lattesIds: [String]) {
    members(lattesIds: $lattesIds) {
      _id
    }
  }
`;

class ProductionIndicator extends Component {
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
    };

    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
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
    });
  }

  handleGroupChange(e) {
    const groupSelection = e.target.value;
    const { client } = this.props;

    if (groupSelection === 'Nenhum') {
      this.setState({
        groupSelection,
        campusSelection: 'Todos',
        selectedGroupMembers: [],
      });
    } else if (groupSelection === 'Seleção Atual') {
      // Members currently selected in the table
      this.setState({
        groupSelection,
        campusSelection: 'Todos',
        selectedGroupMembers: this.props.selectedMembers,
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
            campusSelection: 'Todos',
            selectedGroupMembers: data.members.map(({ _id }) => _id),
          });
        })
        .catch(() => {
          this.setState({ groupSelection });
        });
    }
  }

  render() {
    const { collection, by } = this.props;
    const {
      selectedGroupMembers, groupNames, groupSelection, campusSelection,
    } = this.state;

    return (
      <ProductionIndicatorQuery
        collection={collection}
        by={by}
        selectedMembers={selectedGroupMembers}
        campusSelection={campusSelection}
      >
        <ProductionVisualization
          groupNames={groupNames}
          groupSelection={groupSelection}
          onGroupChange={this.handleGroupChange}
          onCampusChange={this.handleCampusChange}
        />
      </ProductionIndicatorQuery>
    );
  }
}

ProductionIndicator.propTypes = {
  collection: PropTypes.string,
  by: PropTypes.string,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  client: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

ProductionIndicator.defaultProps = {
  collection: undefined,
  by: 'year',
};

export default withApollo(ProductionIndicator);
